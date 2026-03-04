(() => {
  "use strict";

  // Default configuration settings
  const defaultConfig = {
    applySmartProcessing: true,
    isAdvancedSettingsOpen: false,
    pitchValueCents: 0,
    pitchValueSemitones: 0,
    windowSizeMilliseconds: 120,
  };

  // Minimum correlation threshold
  const MIN_CORRELATION_THRESHOLD = Math.pow(10, -1.2);

  // Helper function to create a deep copy of audio buffers
  function copyAudioBuffers(buffers) {
    const copy = new Array(buffers.length);
    for (let i = 0; i < copy.length; i++) {
      copy[i] = buffers[i].slice();
    }
    return copy;
  }

  // Helper function to get audio sample with wrapping
  function getAudioSample(
    previousBuffer,
    currentBuffer,
    channelIndex,
    sampleIndex
  ) {
    const bufferLength = previousBuffer[0].length;
    const wrappedIndex = sampleIndex % bufferLength;
    return (sampleIndex < bufferLength ? previousBuffer : currentBuffer)[
      channelIndex
    ][wrappedIndex];
  }

  // Main correlation function to find best matching points between audio segments
  function findBestCorrelation(
    previousBuffer,
    currentBuffer,
    previousOffset,
    nextBuffer
  ) {
    const minLength = Math.min(
      previousBuffer[0].length,
      previousBuffer[1].length,
      nextBuffer[0].length,
      nextBuffer[1].length
    );
    const sampleRate = previousBuffer[0][0].length;
    const windowSize = (sampleRate / 8) | 0;

    let bestCorrelation = 0;
    let bestOffset = 0;
    let bestEnergy = 0;

    const correlationSums = new Array(minLength);
    const energySums1 = new Array(minLength);
    const energySums2 = new Array(minLength);

    // For each possible offset
    for (let offset = 0; offset < sampleRate; offset++) {
      correlationSums.fill(0);
      energySums1.fill(0);
      energySums2.fill(0);

      // Process in windows for efficiency
      for (
        let windowStart = 0;
        windowStart < sampleRate;
        windowStart += windowSize
      ) {
        const prevSampleIndex = previousOffset + windowStart;
        const nextSampleIndex = offset + windowStart;

        // Calculate correlation and energy for each sample
        for (let i = 0; i < minLength; i++) {
          const prevSample = getAudioSample(
            previousBuffer,
            currentBuffer,
            i,
            prevSampleIndex
          );
          const nextSample = getAudioSample(
            nextBuffer[0],
            nextBuffer[1],
            i,
            nextSampleIndex
          );

          correlationSums[i] += prevSample * nextSample;
          energySums1[i] += prevSample * prevSample;
          energySums2[i] += nextSample * nextSample;
        }
      }

      // Calculate total correlation score
      let totalCorrelation = 0;
      for (let i = 0; i < correlationSums.length; i++) {
        totalCorrelation +=
          correlationSums[i] /
          Math.sqrt(energySums1[i] * energySums2[i] + 1e-12);
      }

      // Update best match if better correlation found
      if (totalCorrelation > bestCorrelation) {
        bestCorrelation = totalCorrelation;
        bestOffset = offset;
        bestEnergy = Math.sqrt(
          (energySums1.reduce((sum, val) => sum + val, 0) +
            energySums2.reduce((sum, val) => sum + val, 0)) /
            (8 * minLength * 2)
        );
      }
    }

    return [bestOffset, bestEnergy * MIN_CORRELATION_THRESHOLD];
  }

  class PitchShifterProcessor extends AudioWorkletProcessor {
    constructor() {
      super(...arguments);
      this.previousBuffer = [new Float32Array()];
      this.currentBuffer = [new Float32Array()];
      this.controlBuffer = new Float32Array([1]);
      this.correlationThreshold = MIN_CORRELATION_THRESHOLD;
      this.previousOffset = 0;
      this.currentOffset = 0;
    }

    static get parameterDescriptors() {
      return [
        {
          name: "control",
          defaultValue: 0,
          minValue: -1,
          maxValue: 1,
          automationRate: "a-rate",
        },
      ];
    }

    process(inputs, outputs, parameters) {
      const inputChannels = Math.min(
        this.previousBuffer.length,
        inputs[0].length,
        this.currentBuffer.length,
        inputs[1].length
      );
      const outputChannels = outputs[0].length;
      const processLength = Math.min(inputChannels, outputChannels);

      if (processLength === 0) return false;

      // Initialize buffers if empty
      if (this.previousBuffer[0].length === 0) {
        this.previousBuffer = copyAudioBuffers(inputs[0]);
        this.currentBuffer = copyAudioBuffers(inputs[1]);
        this.controlBuffer = parameters.control.slice();
        return true;
      }

      const isMono = inputChannels === 1 && outputChannels > 1;
      const samplesPerChannel = outputs[0][0].length;

      let hasProcessed = false;
      let hasFoundPreviousMatch = false;
      let hasFoundCurrentMatch = false;

      // Reset correlation threshold if too small
      if (this.correlationThreshold < 1e-12) {
        this.correlationThreshold = MIN_CORRELATION_THRESHOLD;
      }

      // Process each sample
      for (
        let sampleIndex = 0;
        sampleIndex < samplesPerChannel;
        sampleIndex++
      ) {
        const controlValue =
          this.controlBuffer.length === 1
            ? this.controlBuffer[0]
            : this.controlBuffer[sampleIndex];

        const crossfadeIn = 0.5 * controlValue + 0.5;
        const crossfadeOut = 0.5 * -controlValue + 0.5;

        // Find best matching points if needed
        if (hasProcessed) {
          if (
            !hasFoundPreviousMatch &&
            crossfadeOut < this.correlationThreshold
          ) {
            [this.currentOffset, this.correlationThreshold] =
              findBestCorrelation(
                [this.previousBuffer, inputs[0]],
                this.previousOffset,
                [this.currentBuffer, inputs[1]]
              );
            hasFoundPreviousMatch = true;
          } else if (
            !hasFoundCurrentMatch &&
            crossfadeIn < this.correlationThreshold
          ) {
            [this.previousOffset, this.correlationThreshold] =
              findBestCorrelation(
                [this.currentBuffer, inputs[1]],
                this.currentOffset,
                [this.previousBuffer, inputs[0]]
              );
            hasFoundCurrentMatch = true;
          }
        }

        const prevSampleIndex = sampleIndex + this.previousOffset;
        const currentSampleIndex = sampleIndex + this.currentOffset;

        // Process audio based on channel configuration
        if (isMono) {
          const mixedSample =
            getAudioSample(this.previousBuffer, inputs[0], 0, prevSampleIndex) *
              crossfadeIn +
            getAudioSample(
              this.currentBuffer,
              inputs[1],
              0,
              currentSampleIndex
            ) *
              crossfadeOut;

          outputs[0][0][sampleIndex] = mixedSample;
          outputs[0][1][sampleIndex] = mixedSample;

          if (!hasProcessed && mixedSample !== 0) {
            hasProcessed = true;
          }
        } else {
          for (let channel = 0; channel < processLength; channel++) {
            const mixedSample =
              getAudioSample(
                this.previousBuffer,
                inputs[0],
                channel,
                prevSampleIndex
              ) *
                crossfadeIn +
              getAudioSample(
                this.currentBuffer,
                inputs[1],
                channel,
                currentSampleIndex
              ) *
                crossfadeOut;

            outputs[0][channel][sampleIndex] = mixedSample;

            if (!hasProcessed && mixedSample !== 0) {
              hasProcessed = true;
            }
          }
        }
      }

      // Update buffers for next processing cycle
      this.previousBuffer = copyAudioBuffers(inputs[0]);
      this.currentBuffer = copyAudioBuffers(inputs[1]);
      this.controlBuffer = parameters.control.slice();

      return true;
    }
  }

  registerProcessor("pitch-changer-extension-c", PitchShifterProcessor);
})();
