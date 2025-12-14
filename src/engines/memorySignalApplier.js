function normalizeText(s) {
  return String(s || "").trim();
}

function firstOf(arr) {
  return Array.isArray(arr) && arr.length ? arr[0] : null;
}

function mapTopicFromSignalCode(signalCode) {
  if (signalCode === "TOPIC_WORK") return "work";
  if (signalCode === "TOPIC_RELATIONSHIPS") return "relationships";
  if (signalCode === "TOPIC_SELF") return "self";
  return "";
}

function mapTopicFromContext(contextHalo) {
  const c = normalizeText(contextHalo).toLowerCase();

  if (!c) return "";
  if (c.includes("work")) return "work";
  if (c.includes("relationship")) return "relationships";
  if (c.includes("self")) return "self";

  return "";
}

function applyMemorySignals(memorySnapshot, extracted) {
  const snapshot = memorySnapshot && typeof memorySnapshot === "object" ? memorySnapshot : {};
  const objects = extracted && Array.isArray(extracted.objects) ? extracted.objects : [];

  const next = {
    last_topic: normalizeText(snapshot.last_topic),
    last_context: normalizeText(snapshot.last_context),
    last_safety_flag: normalizeText(snapshot.last_safety_flag),
    hesitation_signal: !!snapshot.hesitation_signal,
    last_signal_codes: Array.isArray(snapshot.last_signal_codes) ? snapshot.last_signal_codes.slice(0) : []
  };

  for (const o of objects) {
    if (!o || typeof o !== "object") continue;

    const code = normalizeText(o.signal_code);
    const type = normalizeText(o.type);
    const category = normalizeText(o.category);

    if (code) {
      next.last_signal_codes.push(code);
      next.last_signal_codes = Array.from(new Set(next.last_signal_codes)).slice(0, 30);
    }

    if (type === "context_log" && category) {
      next.last_context = category;
    }

    if (code === "CONSTRAINT_MARKER") {
      next.hesitation_signal = true;
    }

    if (category === "topic" && code) {
      const topic = mapTopicFromSignalCode(code);
      if (topic) next.last_topic = topic;
    }
  }

  if (!next.last_topic) {
    const fallback = mapTopicFromContext(next.last_context);
    if (fallback) next.last_topic = fallback;
  }

  return next;
}

module.exports = {
  applyMemorySignals
};
