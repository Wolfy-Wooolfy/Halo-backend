/**
 * HALO Liquid Neural Network (LNN) v0.1 - The Silent Biological Clock
 * * Purpose: Models internal cognitive state that evolves over time (Time-Continuous).
 * Rules:
 * - Silent: Never generates text directly.
 * - Dynamic: State decays/grows based on time passed since last interaction.
 * - Inputs: Context, Safety, Message Length, Sentiment.
 * - Outputs: Influence on Routing & Tone (Phase 2+).
 */

const NEURON_CONFIG = {
  // Stress: Builds up with tension/safety flags, decays fast when calm.
  stress: { base: 0.0, decay_per_hour: 0.3, reactivity: 0.5 },
  
  // Fatigue: Builds up with long/frequent messages, decays slow (needs rest).
  fatigue: { base: 0.0, decay_per_hour: 0.1, reactivity: 0.2 },
  
  // Focus: Builds up with planning/decision, decays with confusion/emotion.
  focus:   { base: 0.5, decay_per_hour: 0.1, reactivity: 0.3 },
  
  // Trust: Slow growing, hard to lose, decays very slowly.
  trust:   { base: 0.1, decay_per_hour: 0.001, reactivity: 0.05 }
};

function getInitialLNNState() {
  return {
    lastTick: new Date().toISOString(),
    neurons: {
      stress: 0.0,
      fatigue: 0.0,
      focus: 0.5,
      trust: 0.1
    }
  };
}

/**
 * Calculates the new state based on time passed (Liquid property) and new input.
 */
function tickLNN(currentState, inputSignal) {
  const state = currentState || getInitialLNNState();
  const now = new Date();
  const lastTick = new Date(state.lastTick);
  
  // 1. Calculate Time Delta (in Hours)
  // Prevent negative delta or NaN
  let deltaHours = (now - lastTick) / (1000 * 60 * 60);
  if (isNaN(deltaHours) || deltaHours < 0) deltaHours = 0;

  const nextNeurons = { ...state.neurons };

  // 2. Apply Natural Decay (The "Liquid" part)
  // Formula: New = Current * (1 - DecayRate * DeltaHours)
  for (const [key, config] of Object.entries(NEURON_CONFIG)) {
    const currentVal = nextNeurons[key] || config.base;
    // Decay towards base
    if (currentVal > config.base) {
      nextNeurons[key] = Math.max(config.base, currentVal - (config.decay_per_hour * deltaHours));
    } else if (currentVal < config.base) {
      nextNeurons[key] = Math.min(config.base, currentVal + (config.decay_per_hour * deltaHours));
    }
  }

  // 3. Apply Input Stimulus (Reaction)
  const { context, safety, messageLength, semanticScore } = inputSignal;

  // -- Stress Logic --
  let stressImpact = 0;
  if (safety !== "none") stressImpact += 0.4;
  if (context === "emotional_discomfort" || context === "high_stress") stressImpact += 0.2;
  if (context === "general" || context === "planning") stressImpact -= 0.1;
  nextNeurons.stress = Math.max(0, Math.min(1, nextNeurons.stress + stressImpact));

  // -- Fatigue Logic --
  // Long messages increase fatigue slightly
  let fatigueImpact = (messageLength > 200 ? 0.1 : 0.05);
  nextNeurons.fatigue = Math.max(0, Math.min(1, nextNeurons.fatigue + fatigueImpact));

  // -- Focus Logic --
  let focusImpact = 0;
  if (context === "planning" || context === "decision") focusImpact += 0.2;
  if (context === "emotional_discomfort") focusImpact -= 0.15;
  // Semantic activation (from memory engine) boosts focus
  if (semanticScore > 0) focusImpact += 0.1;
  nextNeurons.focus = Math.max(0, Math.min(1, nextNeurons.focus + focusImpact));

  // -- Trust Logic --
  // Consistent interaction builds trust
  nextNeurons.trust = Math.max(0, Math.min(1, nextNeurons.trust + 0.01));

  return {
    lastTick: now.toISOString(),
    neurons: nextNeurons,
    delta_hours: deltaHours // for debugging
  };
}

module.exports = {
  getInitialLNNState,
  tickLNN
};