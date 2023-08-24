import Fraction from "fraction.js";
Fraction.prototype.sam = function() {
  return this.floor();
};
Fraction.prototype.nextSam = function() {
  return this.sam().add(1);
};
Fraction.prototype.wholeCycle = function() {
  return new TimeSpan(this.sam(), this.nextSam());
};
Fraction.prototype.cyclePos = function() {
  return this.sub(this.sam());
};
Fraction.prototype.lt = function(t) {
  return this.compare(t) < 0;
};
Fraction.prototype.gt = function(t) {
  return this.compare(t) > 0;
};
Fraction.prototype.lte = function(t) {
  return this.compare(t) <= 0;
};
Fraction.prototype.gte = function(t) {
  return this.compare(t) >= 0;
};
Fraction.prototype.eq = function(t) {
  return this.compare(t) == 0;
};
Fraction.prototype.max = function(t) {
  return this.gt(t) ? this : t;
};
Fraction.prototype.min = function(t) {
  return this.lt(t) ? this : t;
};
Fraction.prototype.show = function() {
  return this.s * this.n + "/" + this.d;
};
Fraction.prototype.or = function(t) {
  return this.eq(0) ? t : this;
};
const fraction = (t) => Fraction(t), gcd = (...t) => t.reduce((e, n) => e.gcd(n), fraction(1));
fraction._original = Fraction;
class TimeSpan {
  constructor(e, n) {
    this.begin = fraction(e), this.end = fraction(n);
  }
  get spanCycles() {
    const e = [];
    var n = this.begin;
    const o = this.end, s = o.sam();
    if (n.equals(o))
      return [new TimeSpan(n, o)];
    for (; o.gt(n); ) {
      if (n.sam().equals(s)) {
        e.push(new TimeSpan(n, this.end));
        break;
      }
      const i = n.nextSam();
      e.push(new TimeSpan(n, i)), n = i;
    }
    return e;
  }
  get duration() {
    return this.end.sub(this.begin);
  }
  cycleArc() {
    const e = this.begin.cyclePos(), n = e.add(this.duration);
    return new TimeSpan(e, n);
  }
  withTime(e) {
    return new TimeSpan(e(this.begin), e(this.end));
  }
  withEnd(e) {
    return new TimeSpan(this.begin, e(this.end));
  }
  withCycle(e) {
    const n = this.begin.sam(), o = n.add(e(this.begin.sub(n))), s = n.add(e(this.end.sub(n)));
    return new TimeSpan(o, s);
  }
  intersection(e) {
    const n = this.begin.max(e.begin), o = this.end.min(e.end);
    if (!n.gt(o) && !(n.equals(o) && (n.equals(this.end) && this.begin.lt(this.end) || n.equals(e.end) && e.begin.lt(e.end))))
      return new TimeSpan(n, o);
  }
  intersection_e(e) {
    const n = this.intersection(e);
    if (n == null)
      throw "TimeSpans do not intersect";
    return n;
  }
  midpoint() {
    return this.begin.add(this.duration.div(fraction(2)));
  }
  equals(e) {
    return this.begin.equals(e.begin) && this.end.equals(e.end);
  }
  show() {
    return this.begin.show() + " → " + this.end.show();
  }
}
class Hap {
  /*
        Event class, representing a value active during the timespan
        'part'. This might be a fragment of an event, in which case the
        timespan will be smaller than the 'whole' timespan, otherwise the
        two timespans will be the same. The 'part' must never extend outside of the
        'whole'. If the event represents a continuously changing value
        then the whole will be returned as None, in which case the given
        value will have been sampled from the point halfway between the
        start and end of the 'part' timespan.
        The context is to store a list of source code locations causing the event.
  
        The word 'Event' is more or less a reserved word in javascript, hence this
        class is named called 'Hap'.
        */
  constructor(e, n, o, s = {}, i = !1) {
    this.whole = e, this.part = n, this.value = o, this.context = s, this.stateful = i, i && console.assert(typeof this.value == "function", "Stateful values must be functions");
  }
  get duration() {
    return this.whole.end.sub(this.whole.begin).mul(typeof this.value?.clip == "number" ? this.value?.clip : 1);
  }
  get endClipped() {
    return this.whole.begin.add(this.duration);
  }
  wholeOrPart() {
    return this.whole ? this.whole : this.part;
  }
  withSpan(e) {
    const n = this.whole ? e(this.whole) : void 0;
    return new Hap(n, e(this.part), this.value, this.context);
  }
  withValue(e) {
    return new Hap(this.whole, this.part, e(this.value), this.context);
  }
  hasOnset() {
    return this.whole != null && this.whole.begin.equals(this.part.begin);
  }
  resolveState(e) {
    if (this.stateful && this.hasOnset()) {
      console.log("stateful");
      const n = this.value, [o, s] = n(e);
      return [o, new Hap(this.whole, this.part, s, this.context, !1)];
    }
    return [e, this];
  }
  spanEquals(e) {
    return this.whole == null && e.whole == null || this.whole.equals(e.whole);
  }
  equals(e) {
    return this.spanEquals(e) && this.part.equals(e.part) && // TODO would == be better ??
    this.value === e.value;
  }
  show(e = !1) {
    const n = typeof this.value == "object" ? e ? JSON.stringify(this.value).slice(1, -1).replaceAll('"', "").replaceAll(",", " ") : JSON.stringify(this.value) : this.value;
    var o = "";
    if (this.whole == null)
      o = "~" + this.part.show;
    else {
      var s = this.whole.begin.equals(this.part.begin) && this.whole.end.equals(this.part.end);
      this.whole.begin.equals(this.part.begin) || (o = this.whole.begin.show() + " ⇜ "), s || (o += "("), o += this.part.show(), s || (o += ")"), this.whole.end.equals(this.part.end) || (o += " ⇝ " + this.whole.end.show());
    }
    return "[ " + o + " | " + n + " ]";
  }
  showWhole(e = !1) {
    return `${this.whole == null ? "~" : this.whole.show()}: ${typeof this.value == "object" ? e ? JSON.stringify(this.value).slice(1, -1).replaceAll('"', "").replaceAll(",", " ") : JSON.stringify(this.value) : this.value}`;
  }
  combineContext(e) {
    const n = this;
    return { ...n.context, ...e.context, locations: (n.context.locations || []).concat(e.context.locations || []) };
  }
  setContext(e) {
    return new Hap(this.whole, this.part, this.value, e);
  }
  ensureObjectValue() {
    if (typeof this.value != "object")
      throw new Error(
        `expected hap.value to be an object, but got "${this.value}". Hint: append .note() or .s() to the end`,
        "error"
      );
  }
}
class State {
  constructor(e, n = {}) {
    this.span = e, this.controls = n;
  }
  // Returns new State with different span
  setSpan(e) {
    return new State(e, this.controls);
  }
  withSpan(e) {
    return this.setSpan(e(this.span));
  }
  // Returns new State with different controls
  setControls(e) {
    return new State(this.span, e);
  }
}
const isNoteWithOctave = (t) => /^[a-gA-G][#bs]*[0-9]$/.test(t), isNote = (t) => /^[a-gA-G][#bsf]*[0-9]?$/.test(t), tokenizeNote = (t) => {
  if (typeof t != "string")
    return [];
  const [e, n = "", o] = t.match(/^([a-gA-G])([#bsf]*)([0-9]*)$/)?.slice(1) || [];
  return e ? [e, n, o ? Number(o) : void 0] : [];
}, chromas = { c: 0, d: 2, e: 4, f: 5, g: 7, a: 9, b: 11 }, accs = { "#": 1, b: -1, s: 1, f: -1 }, noteToMidi = (t, e = 3) => {
  const [n, o, s = e] = tokenizeNote(t);
  if (!n)
    throw new Error('not a note: "' + t + '"');
  const i = chromas[n.toLowerCase()], a = o?.split("").reduce((u, c) => u + accs[c], 0) || 0;
  return (Number(s) + 1) * 12 + i + a;
}, midiToFreq = (t) => Math.pow(2, (t - 69) / 12) * 440, freqToMidi = (t) => 12 * Math.log(t / 440) / Math.LN2 + 69, valueToMidi = (t, e) => {
  if (typeof t != "object")
    throw new Error("valueToMidi: expected object value");
  let { freq: n, note: o } = t;
  if (typeof n == "number")
    return freqToMidi(n);
  if (typeof o == "string")
    return noteToMidi(o);
  if (typeof o == "number")
    return o;
  if (!e)
    throw new Error("valueToMidi: expected freq or note to be set");
  return e;
}, getFreq = (t) => midiToFreq(typeof t == "number" ? t : noteToMidi(t)), pcs = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"], midi2note = (t) => {
  const e = Math.floor(t / 12) - 1;
  return pcs[t % 12] + e;
}, _mod = (t, e) => (t % e + e) % e, getPlayableNoteValue = (t) => {
  let { value: e, context: n } = t, o = e;
  if (typeof o == "object" && !Array.isArray(o) && (o = o.note || o.n || o.value, o === void 0))
    throw new Error(`cannot find a playable note for ${JSON.stringify(e)}`);
  if (typeof o == "number" && n.type !== "frequency")
    o = midiToFreq(t.value);
  else if (typeof o == "number" && n.type === "frequency")
    o = t.value;
  else if (typeof o != "string" || !isNote(o))
    throw new Error("not a note: " + JSON.stringify(o));
  return o;
}, getFrequency = (t) => {
  let { value: e, context: n } = t;
  if (typeof e == "object")
    return e.freq ? e.freq : getFreq(e.note || e.n || e.value);
  if (typeof e == "number" && n.type !== "frequency")
    e = midiToFreq(t.value);
  else if (typeof e == "string" && isNote(e))
    e = midiToFreq(noteToMidi(t.value));
  else if (typeof e != "number")
    throw new Error("not a note or frequency: " + e);
  return e;
}, rotate = (t, e) => t.slice(e).concat(t.slice(0, e)), pipe = (...t) => t.reduce(
  (e, n) => (...o) => e(n(...o)),
  (e) => e
), compose = (...t) => pipe(...t.reverse()), removeUndefineds = (t) => t.filter((e) => e != null), flatten = (t) => [].concat(...t), id = (t) => t, constant = (t, e) => t, listRange = (t, e) => Array.from({ length: e - t + 1 }, (n, o) => o + t);
function curry(t, e, n = t.length) {
  const o = function s(...i) {
    if (i.length >= n)
      return t.apply(this, i);
    {
      const a = function(...u) {
        return s.apply(this, i.concat(u));
      };
      return e && e(a, i), a;
    }
  };
  return e && e(o, []), o;
}
function parseNumeral(t) {
  const e = Number(t);
  if (!isNaN(e))
    return e;
  if (isNote(t))
    return noteToMidi(t);
  throw new Error(`cannot parse as numeral: "${t}"`);
}
function mapArgs(t, e) {
  return (...n) => t(...n.map(e));
}
function numeralArgs(t) {
  return mapArgs(t, parseNumeral);
}
function parseFractional(t) {
  const e = Number(t);
  if (!isNaN(e))
    return e;
  const n = {
    pi: Math.PI,
    w: 1,
    h: 0.5,
    q: 0.25,
    e: 0.125,
    s: 0.0625,
    t: 1 / 3,
    f: 0.2,
    x: 1 / 6
  }[t];
  if (typeof n < "u")
    return n;
  throw new Error(`cannot parse as fractional: "${t}"`);
}
const fractionalArgs = (t) => mapArgs(t, parseFractional), splitAt = function(t, e) {
  return [e.slice(0, t), e.slice(t)];
}, zipWith = (t, e, n) => e.map((o, s) => t(o, n[s])), clamp = (t, e, n) => Math.min(Math.max(t, e), n), solfeggio = ["Do", "Reb", "Re", "Mib", "Mi", "Fa", "Solb", "Sol", "Lab", "La", "Sib", "Si"], indian = [
  "Sa",
  "Re",
  "Ga",
  "Ma",
  "Pa",
  "Dha",
  "Ni"
], german = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Hb", "H"], byzantine = [
  "Ni",
  "Pab",
  "Pa",
  "Voub",
  "Vou",
  "Ga",
  "Dib",
  "Di",
  "Keb",
  "Ke",
  "Zob",
  "Zo"
], japanese = [
  "I",
  "Ro",
  "Ha",
  "Ni",
  "Ho",
  "He",
  "To"
], english = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"], sol2note = (t, e = "letters") => {
  const o = (e === "solfeggio" ? solfeggio : e === "indian" ? indian : e === "german" ? german : e === "byzantine" ? byzantine : e === "japanese" ? japanese : english)[t % 12], s = Math.floor(t / 12) - 1;
  return o + s;
};
function unionWithObj(t, e, n) {
  if (typeof e?.value == "number") {
    const s = Object.keys(t).filter((a) => typeof t[a] == "number"), i = Object.fromEntries(s.map((a) => [a, e.value]));
    e = Object.assign(e, i), delete e.value;
  }
  const o = Object.keys(t).filter((s) => Object.keys(e).includes(s));
  return Object.assign({}, t, e, Object.fromEntries(o.map((s) => [s, n(t[s], e[s])])));
}
curry((t, e) => t * e);
curry((t, e) => e.map(t));
function drawLine(t, e = 60) {
  let n = 0, o = fraction(0), s = [""], i = "";
  for (; s[0].length < e; ) {
    const a = t.queryArc(n, n + 1), u = a.filter((l) => l.hasOnset()).map((l) => l.duration), c = gcd(...u), f = c.inverse();
    s = s.map((l) => l + "|"), i += "|";
    for (let l = 0; l < f; l++) {
      const [p, d] = [o, o.add(c)], m = a.filter((k) => k.whole.begin.lte(p) && k.whole.end.gte(d)), S = m.length - s.length;
      S > 0 && (s = s.concat(Array(S).fill(i))), s = s.map((k, v) => {
        const q = m[v];
        if (q) {
          const b = q.whole.begin.eq(p) ? "" + q.value : "-";
          return k + b;
        }
        return k + ".";
      }), i += ".", o = o.add(c);
    }
    n++;
  }
  return s.join(`
`);
}
const logKey = "strudel.log";
function logger(t, e, n = {}) {
  console.log(`%c${t}`, "background-color: black;color:white;border-radius:15px"), typeof document < "u" && typeof CustomEvent < "u" && document.dispatchEvent(
    new CustomEvent(logKey, {
      detail: {
        message: t,
        type: e,
        data: n
      }
    })
  );
}
logger.key = logKey;
let stringParser;
const setStringParser = (t) => stringParser = t;
class Pattern {
  /**
   * Create a pattern. As an end user, you will most likely not create a Pattern directly.
   *
   * @param {function} query - The function that maps a {@link State} to an array of {@link Hap}.
   * @noAutocomplete
   */
  constructor(e) {
    this.query = e, this._Pattern = !0;
  }
  //////////////////////////////////////////////////////////////////////
  // Haskell-style functor, applicative and monadic operations
  /**
   * Returns a new pattern, with the function applied to the value of
   * each hap. It has the alias {@link Pattern#fmap}.
   * @synonyms fmap
   * @param {Function} func to to apply to the value
   * @returns Pattern
   * @example
   * "0 1 2".withValue(v => v + 10).log()
   */
  withValue(e) {
    return new Pattern((n) => this.query(n).map((o) => o.withValue(e)));
  }
  /**
   * see {@link Pattern#withValue}
   * @noAutocomplete
   */
  fmap(e) {
    return this.withValue(e);
  }
  /**
   * Assumes 'this' is a pattern of functions, and given a function to
   * resolve wholes, applies a given pattern of values to that
   * pattern of functions.
   * @param {Function} whole_func
   * @param {Function} func
   * @noAutocomplete
   * @returns Pattern
   */
  appWhole(e, n) {
    const o = this, s = function(i) {
      const a = o.query(i), u = n.query(i), c = function(f, l) {
        const p = f.part.intersection(l.part);
        if (p != null)
          return new Hap(
            e(f.whole, l.whole),
            p,
            f.value(l.value),
            l.combineContext(f)
          );
      };
      return flatten(
        a.map((f) => removeUndefineds(u.map((l) => c(f, l))))
      );
    };
    return new Pattern(s);
  }
  /**
   * When this method is called on a pattern of functions, it matches its haps
   * with those in the given pattern of values.  A new pattern is returned, with
   * each matching value applied to the corresponding function.
   *
   * In this `_appBoth` variant, where timespans of the function and value haps
   * are not the same but do intersect, the resulting hap has a timespan of the
   * intersection. This applies to both the part and the whole timespan.
   * @param {Pattern} pat_val
   * @noAutocomplete
   * @returns Pattern
   */
  appBoth(e) {
    const n = function(o, s) {
      if (!(o == null || s == null))
        return o.intersection_e(s);
    };
    return this.appWhole(n, e);
  }
  /**
   * As with {@link Pattern#appBoth}, but the `whole` timespan is not the intersection,
   * but the timespan from the function of patterns that this method is called
   * on. In practice, this means that the pattern structure, including onsets,
   * are preserved from the pattern of functions (often referred to as the left
   * hand or inner pattern).
   * @param {Pattern} pat_val
   * @noAutocomplete
   * @returns Pattern
   */
  appLeft(e) {
    const n = this, o = function(s) {
      const i = [];
      for (const a of n.query(s)) {
        const u = e.query(s.setSpan(a.wholeOrPart()));
        for (const c of u) {
          const f = a.whole, l = a.part.intersection(c.part);
          if (l) {
            const p = a.value(c.value), d = c.combineContext(a), m = new Hap(f, l, p, d);
            i.push(m);
          }
        }
      }
      return i;
    };
    return new Pattern(o);
  }
  /**
   * As with {@link Pattern#appLeft}, but `whole` timespans are instead taken from the
   * pattern of values, i.e. structure is preserved from the right hand/outer
   * pattern.
   * @param {Pattern} pat_val
   * @noAutocomplete
   * @returns Pattern
   */
  appRight(e) {
    const n = this, o = function(s) {
      const i = [];
      for (const a of e.query(s)) {
        const u = n.query(s.setSpan(a.wholeOrPart()));
        for (const c of u) {
          const f = a.whole, l = c.part.intersection(a.part);
          if (l) {
            const p = c.value(a.value), d = a.combineContext(c), m = new Hap(f, l, p, d);
            i.push(m);
          }
        }
      }
      return i;
    };
    return new Pattern(o);
  }
  bindWhole(e, n) {
    const o = this, s = function(i) {
      const a = function(c, f) {
        return new Hap(
          e(c.whole, f.whole),
          f.part,
          f.value,
          Object.assign({}, c.context, f.context, {
            locations: (c.context.locations || []).concat(f.context.locations || [])
          })
        );
      }, u = function(c) {
        return n(c.value).query(i.setSpan(c.part)).map((f) => a(c, f));
      };
      return flatten(o.query(i).map((c) => u(c)));
    };
    return new Pattern(s);
  }
  bind(e) {
    const n = function(o, s) {
      if (!(o == null || s == null))
        return o.intersection_e(s);
    };
    return this.bindWhole(n, e);
  }
  join() {
    return this.bind(id);
  }
  outerBind(e) {
    return this.bindWhole((n) => n, e);
  }
  outerJoin() {
    return this.outerBind(id);
  }
  innerBind(e) {
    return this.bindWhole((n, o) => o, e);
  }
  innerJoin() {
    return this.innerBind(id);
  }
  // Flatterns patterns of patterns, by retriggering/resetting inner patterns at onsets of outer pattern haps
  trigJoin(e = !1) {
    const n = this;
    return new Pattern((o) => n.discreteOnly().query(o).map((s) => s.value.late(e ? s.whole.begin : s.whole.begin.cyclePos()).query(o).map(
      (i) => new Hap(
        // Supports continuous haps in the inner pattern
        i.whole ? i.whole.intersection(s.whole) : void 0,
        i.part.intersection(s.part),
        i.value
      ).setContext(s.combineContext(i))
    ).filter((i) => i.part)).flat());
  }
  trigzeroJoin() {
    return this.trigJoin(!0);
  }
  // Like the other joins above, joins a pattern of patterns of values, into a flatter
  // pattern of values. In this case it takes whole cycles of the inner pattern to fit each event
  // in the outer pattern.
  squeezeJoin() {
    const e = this;
    function n(o) {
      const s = e.discreteOnly().query(o);
      function i(u) {
        const f = u.value._focusSpan(u.wholeOrPart()).query(o.setSpan(u.part));
        function l(p, d) {
          let m;
          if (d.whole && p.whole && (m = d.whole.intersection(p.whole), !m))
            return;
          const S = d.part.intersection(p.part);
          if (!S)
            return;
          const k = d.combineContext(p);
          return new Hap(m, S, d.value, k);
        }
        return f.map((p) => l(u, p));
      }
      return flatten(s.map(i)).filter((u) => u);
    }
    return new Pattern(n);
  }
  squeezeBind(e) {
    return this.fmap(e).squeezeJoin();
  }
  //////////////////////////////////////////////////////////////////////
  // Utility methods mainly for internal use
  /**
   * Query haps inside the given time span.
   *
   * @param {Fraction | number} begin from time
   * @param {Fraction | number} end to time
   * @returns Hap[]
   * @example
   * const pattern = sequence('a', ['b', 'c'])
   * const haps = pattern.queryArc(0, 1)
   * console.log(haps)
   * silence
   * @noAutocomplete
   */
  queryArc(e, n) {
    try {
      return this.query(new State(new TimeSpan(e, n)));
    } catch (o) {
      return logger(`[query]: ${o.message}`, "error"), [];
    }
  }
  /**
   * Returns a new pattern, with queries split at cycle boundaries. This makes
   * some calculations easier to express, as all haps are then constrained to
   * happen within a cycle.
   * @returns Pattern
   * @noAutocomplete
   */
  splitQueries() {
    const e = this, n = (o) => flatten(o.span.spanCycles.map((s) => e.query(o.setSpan(s))));
    return new Pattern(n);
  }
  /**
   * Returns a new pattern, where the given function is applied to the query
   * timespan before passing it to the original pattern.
   * @param {Function} func the function to apply
   * @returns Pattern
   * @noAutocomplete
   */
  withQuerySpan(e) {
    return new Pattern((n) => this.query(n.withSpan(e)));
  }
  withQuerySpanMaybe(e) {
    const n = this;
    return new Pattern((o) => {
      const s = o.withSpan(e);
      return s.span ? n.query(s) : [];
    });
  }
  /**
   * As with {@link Pattern#withQuerySpan}, but the function is applied to both the
   * begin and end time of the query timespan.
   * @param {Function} func the function to apply
   * @returns Pattern
   * @noAutocomplete
   */
  withQueryTime(e) {
    return new Pattern((n) => this.query(n.withSpan((o) => o.withTime(e))));
  }
  /**
   * Similar to {@link Pattern#withQuerySpan}, but the function is applied to the timespans
   * of all haps returned by pattern queries (both `part` timespans, and where
   * present, `whole` timespans).
   * @param {Function} func
   * @returns Pattern
   * @noAutocomplete
   */
  withHapSpan(e) {
    return new Pattern((n) => this.query(n).map((o) => o.withSpan(e)));
  }
  /**
   * As with {@link Pattern#withHapSpan}, but the function is applied to both the
   * begin and end time of the hap timespans.
   * @param {Function} func the function to apply
   * @returns Pattern
   * @noAutocomplete
   */
  withHapTime(e) {
    return this.withHapSpan((n) => n.withTime(e));
  }
  /**
   * Returns a new pattern with the given function applied to the list of haps returned by every query.
   * @param {Function} func
   * @returns Pattern
   * @noAutocomplete
   */
  withHaps(e) {
    return new Pattern((n) => e(this.query(n)));
  }
  /**
   * As with {@link Pattern#withHaps}, but applies the function to every hap, rather than every list of haps.
   * @param {Function} func
   * @returns Pattern
   * @noAutocomplete
   */
  withHap(e) {
    return this.withHaps((n) => n.map(e));
  }
  /**
   * Returns a new pattern with the context field set to every hap set to the given value.
   * @param {*} context
   * @returns Pattern
   * @noAutocomplete
   */
  setContext(e) {
    return this.withHap((n) => n.setContext(e));
  }
  /**
   * Returns a new pattern with the given function applied to the context field of every hap.
   * @param {Function} func
   * @returns Pattern
   * @noAutocomplete
   */
  withContext(e) {
    return this.withHap((n) => n.setContext(e(n.context)));
  }
  /**
   * Returns a new pattern with the context field of every hap set to an empty object.
   * @returns Pattern
   * @noAutocomplete
   */
  stripContext() {
    return this.withHap((e) => e.setContext({}));
  }
  /**
   * Returns a new pattern with the given location information added to the
   * context of every hap.
   * @param {Number} start start offset
   * @param {Number} end end offset
   * @returns Pattern
   * @noAutocomplete
   */
  withLoc(e, n) {
    const o = {
      start: e,
      end: n
    };
    return this.withContext((s) => {
      const i = (s.locations || []).concat([o]);
      return { ...s, locations: i };
    });
  }
  /**
   * Returns a new Pattern, which only returns haps that meet the given test.
   * @param {Function} hap_test - a function which returns false for haps to be removed from the pattern
   * @returns Pattern
   * @noAutocomplete
   */
  filterHaps(e) {
    return new Pattern((n) => this.query(n).filter(e));
  }
  /**
   * As with {@link Pattern#filterHaps}, but the function is applied to values
   * inside haps.
   * @param {Function} value_test
   * @returns Pattern
   * @noAutocomplete
   */
  filterValues(e) {
    return new Pattern((n) => this.query(n).filter((o) => e(o.value)));
  }
  /**
   * Returns a new pattern, with haps containing undefined values removed from
   * query results.
   * @returns Pattern
   * @noAutocomplete
   */
  removeUndefineds() {
    return this.filterValues((e) => e != null);
  }
  /**
   * Returns a new pattern, with all haps without onsets filtered out. A hap
   * with an onset is one with a `whole` timespan that begins at the same time
   * as its `part` timespan.
   * @returns Pattern
   * @noAutocomplete
   */
  onsetsOnly() {
    return this.filterHaps((e) => e.hasOnset());
  }
  /**
   * Returns a new pattern, with 'continuous' haps (those without 'whole'
   * timespans) removed from query results.
   * @returns Pattern
   * @noAutocomplete
   */
  discreteOnly() {
    return this.filterHaps((e) => e.whole);
  }
  /**
   * Combines adjacent haps with the same value and whole.  Only
   * intended for use in tests.
   * @noAutocomplete
   */
  defragmentHaps() {
    return this.discreteOnly().withHaps((n) => {
      const o = [];
      for (var s = 0; s < n.length; ++s) {
        for (var i = !0, a = n[s]; i; ) {
          const f = JSON.stringify(n[s].value);
          for (var u = !1, c = s + 1; c < n.length; c++) {
            const l = n[c];
            if (a.whole.equals(l.whole)) {
              if (a.part.begin.eq(l.part.end)) {
                if (f === JSON.stringify(l.value)) {
                  a = new Hap(a.whole, new TimeSpan(l.part.begin, a.part.end), a.value), n.splice(c, 1), u = !0;
                  break;
                }
              } else if (l.part.begin.eq(a.part.end) && f == JSON.stringify(l.value)) {
                a = new Hap(a.whole, new TimeSpan(a.part.begin, l.part.end), a.value), n.splice(c, 1), u = !0;
                break;
              }
            }
          }
          i = u;
        }
        o.push(a);
      }
      return o;
    });
  }
  /**
   * Queries the pattern for the first cycle, returning Haps. Mainly of use when
   * debugging a pattern.
   * @param {Boolean} with_context - set to true, otherwise the context field
   * will be stripped from the resulting haps.
   * @returns [Hap]
   * @noAutocomplete
   */
  firstCycle(e = !1) {
    var n = this;
    return e || (n = n.stripContext()), n.query(new State(new TimeSpan(fraction(0), fraction(1))));
  }
  /**
   * Accessor for a list of values returned by querying the first cycle.
   * @noAutocomplete
   */
  get firstCycleValues() {
    return this.firstCycle().map((e) => e.value);
  }
  /**
   * More human-readable version of the {@link Pattern#firstCycleValues} accessor.
   * @noAutocomplete
   */
  get showFirstCycle() {
    return this.firstCycle().map(
      (e) => `${e.value}: ${e.whole.begin.toFraction()} - ${e.whole.end.toFraction()}`
    );
  }
  /**
   * Returns a new pattern, which returns haps sorted in temporal order. Mainly
   * of use when comparing two patterns for equality, in tests.
   * @returns Pattern
   * @noAutocomplete
   */
  sortHapsByPart() {
    return this.withHaps(
      (e) => e.sort(
        (n, o) => n.part.begin.sub(o.part.begin).or(n.part.end.sub(o.part.end)).or(n.whole.begin.sub(o.whole.begin).or(n.whole.end.sub(o.whole.end)))
      )
    );
  }
  asNumber() {
    return this.fmap(parseNumeral);
  }
  //////////////////////////////////////////////////////////////////////
  // Operators - see 'make composers' later..
  _opIn(e, n) {
    return this.fmap(n).appLeft(reify(e));
  }
  _opOut(e, n) {
    return this.fmap(n).appRight(reify(e));
  }
  _opMix(e, n) {
    return this.fmap(n).appBoth(reify(e));
  }
  _opSqueeze(e, n) {
    const o = reify(e);
    return this.fmap((s) => o.fmap((i) => n(s)(i))).squeezeJoin();
  }
  _opSqueezeOut(e, n) {
    const o = this;
    return reify(e).fmap((i) => o.fmap((a) => n(a)(i))).squeezeJoin();
  }
  _opTrig(e, n) {
    return reify(e).fmap((s) => this.fmap((i) => n(i)(s))).trigJoin();
  }
  _opTrigzero(e, n) {
    return reify(e).fmap((s) => this.fmap((i) => n(i)(s))).trigzeroJoin();
  }
  //////////////////////////////////////////////////////////////////////
  // End-user methods.
  // Those beginning with an underscore (_) are 'patternified',
  // i.e. versions are created without the underscore, that are
  // magically transformed to accept patterns for all their arguments.
  //////////////////////////////////////////////////////////////////////
  // Methods without corresponding toplevel functions
  /**
   * Layers the result of the given function(s). Like {@link Pattern.superimpose}, but without the original pattern:
   * @name layer
   * @memberof Pattern
   * @synonyms apply
   * @returns Pattern
   * @example
   * "<0 2 4 6 ~ 4 ~ 2 0!3 ~!5>*4"
   *   .layer(x=>x.add("0,2"))
   *   .scale('C minor').note()
   */
  layer(...e) {
    return stack(...e.map((n) => n(this)));
  }
  /**
   * Superimposes the result of the given function(s) on top of the original pattern:
   * @name superimpose
   * @memberof Pattern
   * @returns Pattern
   * @example
   * "<0 2 4 6 ~ 4 ~ 2 0!3 ~!5>*4"
   *   .superimpose(x=>x.add(2))
   *   .scale('C minor').note()
   */
  superimpose(...e) {
    return this.stack(...e.map((n) => n(this)));
  }
  //////////////////////////////////////////////////////////////////////
  // Multi-pattern functions
  /**
   * Stacks the given pattern(s) to the current pattern.
   * @name stack
   * @memberof Pattern
   * @example
   * s("hh*2").stack(
   *   note("c2(3,8)")
   * )
   */
  stack(...e) {
    return stack(this, ...e);
  }
  sequence(...e) {
    return sequence(this, ...e);
  }
  /**
   * Appends the given pattern(s) to the current pattern.
   * @name seq
   * @memberof Pattern
   * @synonyms sequence, fastcat
   * @example
   * s("hh*2").seq(
   *   note("c2(3,8)")
   * )
   */
  seq(...e) {
    return sequence(this, ...e);
  }
  /**
   * Appends the given pattern(s) to the next cycle.
   * @name cat
   * @memberof Pattern
   * @synonyms slowcat
   * @example
   * s("hh*2").cat(
   *   note("c2(3,8)")
   * )
   */
  cat(...e) {
    return cat(this, ...e);
  }
  fastcat(...e) {
    return fastcat(this, ...e);
  }
  slowcat(...e) {
    return slowcat(this, ...e);
  }
  //////////////////////////////////////////////////////////////////////
  // Context methods - ones that deal with metadata
  onTrigger(e, n = !0) {
    return this.withHap(
      (o) => o.setContext({
        ...o.context,
        onTrigger: (...s) => {
          o.context.onTrigger?.(...s), e(...s);
        },
        // if dominantTrigger is set to true, the default output (webaudio) will be disabled
        // when using multiple triggers, you cannot flip this flag to false again!
        // example: x.csound('CooLSynth').log() as well as x.log().csound('CooLSynth') should work the same
        dominantTrigger: o.context.dominantTrigger || n
      })
    );
  }
  log(e = (o, s) => `[hap] ${s.showWhole(!0)}`, n = (o, s) => ({ hap: s })) {
    return this.onTrigger((...o) => {
      logger(e(...o), void 0, n(...o));
    }, !1);
  }
  logValues(e = id) {
    return this.log((n, o) => e(o.value));
  }
  //////////////////////////////////////////////////////////////////////
  // Visualisation
  drawLine() {
    return console.log(drawLine(this)), this;
  }
}
function groupHapsBy(t, e) {
  let n = [];
  return e.forEach((o) => {
    const s = n.findIndex(([i]) => t(o, i));
    s === -1 ? n.push([o]) : n[s].push(o);
  }), n;
}
const congruent = (t, e) => t.spanEquals(e);
Pattern.prototype.collect = function() {
  return this.withHaps(
    (t) => groupHapsBy(congruent, t).map((e) => new Hap(e[0].whole, e[0].part, e, {}))
  );
};
Pattern.prototype.arpWith = function(t) {
  return this.collect().fmap((e) => reify(t(e))).innerJoin().withHap((e) => new Hap(e.whole, e.part, e.value.value, e.combineContext(e.value)));
};
Pattern.prototype.arp = function(t) {
  return this.arpWith((e) => t.fmap((n) => e[n % e.length]));
};
function _composeOp(t, e, n) {
  function o(s) {
    return s instanceof Object && !(s instanceof Function);
  }
  return o(t) || o(e) ? (o(t) || (t = { value: t }), o(e) || (e = { value: e }), unionWithObj(t, e, n)) : n(t, e);
}
(function() {
  const t = {
    set: [(n, o) => o],
    keep: [(n) => n],
    keepif: [(n, o) => o ? n : void 0],
    // numerical functions
    /**
     *
     * Assumes a pattern of numbers. Adds the given number to each item in the pattern.
     * @name add
     * @memberof Pattern
     * @example
     * // Here, the triad 0, 2, 4 is shifted by different amounts
     * "0 2 4".add("<0 3 4 0>").scale('C major').note()
     * // Without add, the equivalent would be:
     * // "<[0 2 4] [3 5 7] [4 6 8] [0 2 4]>".scale('C major').note()
     * @example
     * // You can also use add with notes:
     * "c3 e3 g3".add("<0 5 7 0>").note()
     * // Behind the scenes, the notes are converted to midi numbers:
     * // "48 52 55".add("<0 5 7 0>").note()
     */
    add: [numeralArgs((n, o) => n + o)],
    // support string concatenation
    /**
     *
     * Like add, but the given numbers are subtracted.
     * @name sub
     * @memberof Pattern
     * @example
     * "0 2 4".sub("<0 1 2 3>").scale('C4 minor').note()
     * // See add for more information.
     */
    sub: [numeralArgs((n, o) => n - o)],
    /**
     *
     * Multiplies each number by the given factor.
     * @name mul
     * @memberof Pattern
     * @example
     * "1 1.5 [1.66, <2 2.33>]".mul(150).freq()
     */
    mul: [numeralArgs((n, o) => n * o)],
    /**
     *
     * Divides each number by the given factor.
     * @name div
     * @memberof Pattern
     */
    div: [numeralArgs((n, o) => n / o)],
    mod: [numeralArgs(_mod)],
    pow: [numeralArgs(Math.pow)],
    band: [numeralArgs((n, o) => n & o)],
    bor: [numeralArgs((n, o) => n | o)],
    bxor: [numeralArgs((n, o) => n ^ o)],
    blshift: [numeralArgs((n, o) => n << o)],
    brshift: [numeralArgs((n, o) => n >> o)],
    // TODO - force numerical comparison if both look like numbers?
    lt: [(n, o) => n < o],
    gt: [(n, o) => n > o],
    lte: [(n, o) => n <= o],
    gte: [(n, o) => n >= o],
    eq: [(n, o) => n == o],
    eqt: [(n, o) => n === o],
    ne: [(n, o) => n != o],
    net: [(n, o) => n !== o],
    and: [(n, o) => n && o],
    or: [(n, o) => n || o],
    //  bitwise ops
    func: [(n, o) => o(n)]
  }, e = ["In", "Out", "Mix", "Squeeze", "SqueezeOut", "Trig", "Trigzero"];
  for (const [n, [o, s]] of Object.entries(t)) {
    Pattern.prototype["_" + n] = function(i) {
      return this.fmap((a) => o(a, i));
    }, Object.defineProperty(Pattern.prototype, n, {
      // a getter that returns a function, so 'pat' can be
      // accessed by closures that are methods of that function..
      get: function() {
        const i = this, a = (...u) => i[n].in(...u);
        for (const u of e)
          a[u.toLowerCase()] = function(...c) {
            var f = i;
            c = sequence(c), s && (f = s(f), c = s(c));
            var l;
            return n === "keepif" ? (l = f["_op" + u](c, (p) => (d) => o(p, d)), l = l.removeUndefineds()) : l = f["_op" + u](c, (p) => (d) => _composeOp(p, d, o)), l;
          };
        return a.squeezein = a.squeeze, a;
      }
    });
    for (const i of e)
      Pattern.prototype[i.toLowerCase()] = function(...a) {
        return this.set[i.toLowerCase()](a);
      };
  }
  Pattern.prototype.struct = function(...n) {
    return this.keepif.out(...n);
  }, Pattern.prototype.structAll = function(...n) {
    return this.keep.out(...n);
  }, Pattern.prototype.mask = function(...n) {
    return this.keepif.in(...n);
  }, Pattern.prototype.maskAll = function(...n) {
    return this.keep.in(...n);
  }, Pattern.prototype.reset = function(...n) {
    return this.keepif.trig(...n);
  }, Pattern.prototype.resetAll = function(...n) {
    return this.keep.trig(...n);
  }, Pattern.prototype.restart = function(...n) {
    return this.keepif.trigzero(...n);
  }, Pattern.prototype.restartAll = function(...n) {
    return this.keep.trigzero(...n);
  };
})();
const polyrhythm = stack, pr = stack, pm = polymeter;
Pattern.prototype.factories = {
  pure,
  stack,
  slowcat,
  fastcat,
  cat,
  timeCat,
  sequence,
  seq,
  polymeter,
  pm,
  polyrhythm,
  pr
};
const silence = new Pattern(() => []);
function pure(t) {
  function e(n) {
    return n.span.spanCycles.map((o) => new Hap(fraction(o.begin).wholeCycle(), o, t));
  }
  return new Pattern(e);
}
function isPattern(t) {
  return t instanceof Pattern || t?._Pattern;
}
function reify(t) {
  return isPattern(t) ? t : stringParser && typeof t == "string" ? stringParser(t) : pure(t);
}
function stack(...t) {
  t = t.map((n) => Array.isArray(n) ? sequence(...n) : reify(n));
  const e = (n) => flatten(t.map((o) => o.query(n)));
  return new Pattern(e);
}
function slowcat(...t) {
  t = t.map((n) => Array.isArray(n) ? sequence(...n) : reify(n));
  const e = function(n) {
    const o = n.span, s = _mod(o.begin.sam(), t.length), i = t[s];
    if (!i)
      return [];
    const a = o.begin.floor().sub(o.begin.div(t.length).floor());
    return i.withHapTime((u) => u.add(a)).query(n.setSpan(o.withTime((u) => u.sub(a))));
  };
  return new Pattern(e).splitQueries();
}
function slowcatPrime(...t) {
  t = t.map(reify);
  const e = function(n) {
    const o = Math.floor(n.span.begin) % t.length;
    return t[o]?.query(n) || [];
  };
  return new Pattern(e).splitQueries();
}
function cat(...t) {
  return slowcat(...t);
}
function timeCat(...t) {
  const e = t.map((s) => s[0]).reduce((s, i) => s.add(i), fraction(0));
  let n = fraction(0);
  const o = [];
  for (const [s, i] of t) {
    const a = n.add(s);
    o.push(reify(i)._compress(n.div(e), a.div(e))), n = a;
  }
  return stack(...o);
}
function arrange(...t) {
  const e = t.reduce((n, [o]) => n + o, 0);
  return t = t.map(([n, o]) => [n, o.fast(n)]), timeCat(...t).slow(e);
}
function fastcat(...t) {
  return slowcat(...t)._fast(t.length);
}
function sequence(...t) {
  return fastcat(...t);
}
function seq(...t) {
  return fastcat(...t);
}
function _sequenceCount(t) {
  return Array.isArray(t) ? t.length == 0 ? [silence, 0] : t.length == 1 ? _sequenceCount(t[0]) : [fastcat(...t.map((e) => _sequenceCount(e)[0])), t.length] : [reify(t), 1];
}
function polymeterSteps(t, ...e) {
  const n = e.map((s) => _sequenceCount(s));
  if (n.length == 0)
    return silence;
  t == 0 && (t = n[0][1]);
  const o = [];
  for (const s of n)
    s[1] != 0 && (t == s[1] ? o.push(s[0]) : o.push(s[0]._fast(fraction(t).div(fraction(s[1])))));
  return stack(...o);
}
function polymeter(...t) {
  return polymeterSteps(0, ...t);
}
const mask = curry((t, e) => reify(e).mask(t)), struct = curry((t, e) => reify(e).struct(t)), superimpose = curry((t, e) => reify(e).superimpose(...t)), set = curry((t, e) => reify(e).set(t)), keep = curry((t, e) => reify(e).keep(t)), keepif = curry((t, e) => reify(e).keepif(t)), add = curry((t, e) => reify(e).add(t)), sub = curry((t, e) => reify(e).sub(t)), mul = curry((t, e) => reify(e).mul(t)), div = curry((t, e) => reify(e).div(t)), mod = curry((t, e) => reify(e).mod(t)), pow = curry((t, e) => reify(e).pow(t)), band = curry((t, e) => reify(e).band(t)), bor = curry((t, e) => reify(e).bor(t)), bxor = curry((t, e) => reify(e).bxor(t)), blshift = curry((t, e) => reify(e).blshift(t)), brshift = curry((t, e) => reify(e).brshift(t)), lt = curry((t, e) => reify(e).lt(t)), gt = curry((t, e) => reify(e).gt(t)), lte = curry((t, e) => reify(e).lte(t)), gte = curry((t, e) => reify(e).gte(t)), eq = curry((t, e) => reify(e).eq(t)), eqt = curry((t, e) => reify(e).eqt(t)), ne = curry((t, e) => reify(e).ne(t)), net = curry((t, e) => reify(e).net(t)), and = curry((t, e) => reify(e).and(t)), or = curry((t, e) => reify(e).or(t)), func = curry((t, e) => reify(e).func(t));
function register(t, e, n = !0) {
  if (Array.isArray(t)) {
    const i = {};
    for (const a of t)
      i[a] = register(a, e, n);
    return i;
  }
  const o = e.length;
  var s;
  return n ? s = function(...i) {
    i = i.map(reify);
    const a = i[i.length - 1];
    if (o === 1)
      return e(a);
    const [u, ...c] = i.slice(0, -1);
    let f = (...l) => (Array(o - 1).fill().map((p, d) => l[d] ?? void 0), e(...l, a));
    return f = curry(f, null, o - 1), c.reduce((l, p) => l.appLeft(p), u.fmap(f)).innerJoin();
  } : s = function(...i) {
    return i = i.map(reify), e(...i);
  }, Pattern.prototype[t] = function(...i) {
    if (o === 2 && i.length !== 1)
      i = [sequence(...i)];
    else if (o !== i.length + 1)
      throw new Error(`.${t}() expects ${o - 1} inputs but got ${i.length}.`);
    return i = i.map(reify), s(...i, this);
  }, o > 1 && (Pattern.prototype["_" + t] = function(...i) {
    return e(...i, this);
  }), curry(s, null, o);
}
const round = register("round", function(t) {
  return t.asNumber().fmap((e) => Math.round(e));
}), floor = register("floor", function(t) {
  return t.asNumber().fmap((e) => Math.floor(e));
}), ceil = register("ceil", function(t) {
  return t.asNumber().fmap((e) => Math.ceil(e));
}), toBipolar = register("toBipolar", function(t) {
  return t.fmap((e) => e * 2 - 1);
}), fromBipolar = register("fromBipolar", function(t) {
  return t.fmap((e) => (e + 1) / 2);
}), range = register("range", function(t, e, n) {
  return n.mul(e - t).add(t);
}), rangex = register("rangex", function(t, e, n) {
  return n._range(Math.log(t), Math.log(e)).fmap(Math.exp);
}), range2 = register("range2", function(t, e, n) {
  return n.fromBipolar()._range(t, e);
}), ratio = register(
  "ratio",
  (t) => t.fmap((e) => Array.isArray(e) ? e.slice(1).reduce((n, o) => n / o, e[0]) : e)
), compress = register("compress", function(t, e, n) {
  return t = fraction(t), e = fraction(e), t.gt(e) || t.gt(1) || e.gt(1) || t.lt(0) || e.lt(0) ? silence : n._fastGap(fraction(1).div(e.sub(t)))._late(t);
}), { compressSpan, compressspan } = register(["compressSpan", "compressspan"], function(t, e) {
  return e._compress(t.begin, t.end);
}), { fastGap, fastgap } = register(["fastGap", "fastgap"], function(t, e) {
  const n = function(s) {
    const i = s.begin.sam(), a = s.begin.sub(i).mul(t).min(1), u = s.end.sub(i).mul(t).min(1);
    if (!(a >= 1))
      return new TimeSpan(i.add(a), i.add(u));
  }, o = function(s) {
    const i = s.part.begin, a = s.part.end, u = i.sam(), c = i.sub(u).div(t).min(1), f = a.sub(u).div(t).min(1), l = new TimeSpan(u.add(c), u.add(f)), p = s.whole ? new TimeSpan(
      l.begin.sub(i.sub(s.whole.begin).div(t)),
      l.end.add(s.whole.end.sub(a).div(t))
    ) : void 0;
    return new Hap(p, l, s.value, s.context);
  };
  return e.withQuerySpanMaybe(n).withHap(o).splitQueries();
}), focus = register("focus", function(t, e, n) {
  return t = fraction(t), e = fraction(e), n._fast(fraction(1).div(e.sub(t))).late(t.cyclePos());
}), { focusSpan, focusspan } = register(["focusSpan", "focusspan"], function(t, e) {
  return e._focus(t.begin, t.end);
}), ply = register("ply", function(t, e) {
  return e.fmap((n) => pure(n)._fast(t)).squeezeJoin();
}), { fast, density } = register(["fast", "density"], function(t, e) {
  return t === 0 ? silence : (t = fraction(t), e.withQueryTime((o) => o.mul(t)).withHapTime((o) => o.div(t)));
}), hurry = register("hurry", function(t, e) {
  return e._fast(t).mul(pure({ speed: t }));
}), { slow, sparsity } = register(["slow", "sparsity"], function(t, e) {
  return t === 0 ? silence : e._fast(fraction(1).div(t));
}), inside = register("inside", function(t, e, n) {
  return e(n._slow(t))._fast(t);
}), outside = register("outside", function(t, e, n) {
  return e(n._fast(t))._slow(t);
}), lastOf = register("lastOf", function(t, e, n) {
  const o = Array(t - 1).fill(n);
  return o.push(e(n)), slowcatPrime(...o);
}), { firstOf, every } = register(["firstOf", "every"], function(t, e, n) {
  const o = Array(t - 1).fill(n);
  return o.unshift(e(n)), slowcatPrime(...o);
}), apply = register("apply", function(t, e) {
  return t(e);
}), cpm = register("cpm", function(t, e) {
  return e._fast(t / 60);
}), early = register("early", function(t, e) {
  return t = fraction(t), e.withQueryTime((n) => n.add(t)).withHapTime((n) => n.sub(t));
}), late = register("late", function(t, e) {
  return t = fraction(t), e._early(fraction(0).sub(t));
}), zoom = register("zoom", function(t, e, n) {
  e = fraction(e), t = fraction(t);
  const o = e.sub(t);
  return n.withQuerySpan((s) => s.withCycle((i) => i.mul(o).add(t))).withHapSpan((s) => s.withCycle((i) => i.sub(t).div(o))).splitQueries();
}), { zoomArc, zoomarc } = register(["zoomArc", "zoomarc"], function(t, e) {
  return e.zoom(t.begin, t.end);
}), linger = register("linger", function(t, e) {
  return t == 0 ? silence : t < 0 ? e._zoom(t.add(1), 1)._slow(t) : e._zoom(0, t)._slow(t);
}), segment = register("segment", function(t, e) {
  return e.struct(pure(!0)._fast(t));
}), { invert, inv } = register(["invert", "inv"], function(t) {
  return t.fmap((e) => !e);
}), when = register("when", function(t, e, n) {
  return t ? e(n) : n;
}), off = register("off", function(t, e, n) {
  return stack(n, e(n.late(t)));
}), brak = register("brak", function(t) {
  return t.when(slowcat(!1, !0), (e) => fastcat(e, silence)._late(0.25));
}), rev = register("rev", function(t) {
  const e = function(n) {
    const o = n.span, s = o.begin.sam(), i = o.begin.nextSam(), a = function(c) {
      const f = c.withTime((p) => s.add(i.sub(p))), l = f.begin;
      return f.begin = f.end, f.end = l, f;
    };
    return t.query(n.setSpan(a(o))).map((c) => c.withSpan(a));
  };
  return new Pattern(e).splitQueries();
}), pressBy = register("pressBy", function(t, e) {
  return e.fmap((n) => pure(n).compress(t, 1)).squeezeJoin();
}), press = register("press", function(t) {
  return t._pressBy(0.5);
}), hush = register("hush", function(t) {
  return silence;
}), palindrome = register("palindrome", function(t) {
  return t.every(2, rev);
}), { juxBy, juxby } = register(["juxBy", "juxby"], function(t, e, n) {
  t /= 2;
  const o = function(a, u, c) {
    return u in a ? a[u] : c;
  }, s = n.withValue((a) => Object.assign({}, a, { pan: o(a, "pan", 0.5) - t })), i = n.withValue((a) => Object.assign({}, a, { pan: o(a, "pan", 0.5) + t }));
  return stack(s, e(i));
}), jux = register("jux", function(t, e) {
  return e._juxBy(1, t, e);
}), { echoWith, echowith, stutWith, stutwith } = register(
  ["echoWith", "echowith", "stutWith", "stutwith"],
  function(t, e, n, o) {
    return stack(...listRange(0, t - 1).map((s) => n(o.late(fraction(e).mul(s)), s)));
  }
), echo = register("echo", function(t, e, n, o) {
  return o._echoWith(t, e, (s, i) => s.velocity(Math.pow(n, i)));
}), stut = register("stut", function(t, e, n, o) {
  return o._echoWith(t, n, (s, i) => s.velocity(Math.pow(e, i)));
}), _iter = function(t, e, n = !1) {
  return t = fraction(t), slowcat(
    ...listRange(0, t.sub(1)).map(
      (o) => n ? e.late(fraction(o).div(t)) : e.early(fraction(o).div(t))
    )
  );
}, iter = register("iter", function(t, e) {
  return _iter(t, e, !1);
}), { iterBack, iterback } = register(["iterBack", "iterback"], function(t, e) {
  return _iter(t, e, !0);
}), _chunk = function(t, e, n, o = !1) {
  const s = Array(t - 1).fill(!1);
  s.unshift(!0);
  const i = _iter(t, sequence(...s), o);
  return n.when(i, e);
}, chunk = register("chunk", function(t, e, n) {
  return _chunk(t, e, n, !1);
}), { chunkBack, chunkback } = register(["chunkBack", "chunkback"], function(t, e, n) {
  return _chunk(t, e, n, !0);
}), bypass = register("bypass", function(t, e) {
  return t = !!parseInt(t), t ? silence : e;
}), ribbon = register("ribbon", (t, e, n) => n.early(t).restart(pure(1).slow(e))), duration = register("duration", function(t, e) {
  return e.withHapSpan((n) => new TimeSpan(n.begin, n.begin.add(t)));
}), { color, colour } = register(["color", "colour"], function(t, e) {
  return e.withContext((n) => ({ ...n, color: t }));
}), velocity = register("velocity", function(t, e) {
  return e.withContext((n) => ({ ...n, velocity: (n.velocity || 1) * t }));
}), legato = register("legato", function(t, e) {
  return t = fraction(t), e.withHapSpan((n) => new TimeSpan(n.begin, n.begin.add(n.end.sub(n.begin).mul(t))));
}), chop = register("chop", function(t, e) {
  const o = Array.from({ length: t }, (i, a) => a).map((i) => ({ begin: i / t, end: (i + 1) / t })), s = function(i) {
    return sequence(o.map((a) => Object.assign({}, i, a)));
  };
  return e.squeezeBind(s);
}), striate = register("striate", function(t, e) {
  const o = Array.from({ length: t }, (i, a) => a).map((i) => ({ begin: i / t, end: (i + 1) / t })), s = slowcat(...o);
  return e.set(s)._fast(t);
}), _loopAt = function(t, e, n = 1) {
  return e.speed(1 / t * n).unit("c").slow(t);
}, slice = register(
  "slice",
  function(t, e, n) {
    return t.innerBind(
      (o) => e.outerBind(
        (s) => n.outerBind((i) => {
          i = i instanceof Object ? i : { s: i };
          const a = Array.isArray(o) ? o[s] : s / o, u = Array.isArray(o) ? o[s + 1] : (s + 1) / o;
          return pure({ begin: a, end: u, _slices: o, ...i });
        })
      )
    );
  },
  !1
  // turns off auto-patternification
), splice = register(
  "splice",
  function(t, e, n) {
    return slice(t, e, n).withHap(function(s) {
      return s.withValue((i) => ({
        speed: 1 / i._slices / s.whole.duration * (i.speed || 1),
        unit: "c",
        ...i
      }));
    });
  },
  !1
  // turns off auto-patternification
), { loopAt, loopat } = register(["loopAt", "loopat"], function(t, e) {
  return _loopAt(t, e, 1);
}), fit = register(
  "fit",
  (t) => t.withHap(
    (e) => e.withValue((n) => ({
      ...n,
      speed: 1 / e.whole.duration,
      unit: "c"
    }))
  )
), { loopAtCps, loopatcps } = register(["loopAtCps", "loopatcps"], function(t, e, n) {
  return _loopAt(t, n, e);
}), controls = {}, generic_params = [
  /**
   * Select a sound / sample by name. When using mininotation, you can also optionally supply 'n' and 'gain' parameters
   * separated by ':'.
   *
   * @name s
   * @param {string | Pattern} sound The sound / pattern of sounds to pick
   * @synonyms sound
   * @example
   * s("bd hh")
   * @example
   * s("bd:0 bd:1 bd:0:0.3 bd:1:1.4")
   *
   */
  [["s", "n", "gain"], "sound"],
  /**
   * Define a custom webaudio node to use as a sound source.
   *
   * @name source
   * @param {function} getSource
   * @synonyms src
   *
   */
  ["source", "src"],
  /**
   * Selects the given index from the sample map.
   * Numbers too high will wrap around.
   * `n` can also be used to play midi numbers, but it is recommended to use `note` instead.
   *
   * @name n
   * @param {number | Pattern} value sample index starting from 0
   * @example
   * s("bd sd,hh*3").n("<0 1>")
   */
  // also see https://github.com/tidalcycles/strudel/pull/63
  ["n"],
  /**
   * Plays the given note name or midi number. A note name consists of
   *
   * - a letter (a-g or A-G)
   * - optional accidentals (b or #)
   * - optional octave number (0-9). Defaults to 3
   *
   * Examples of valid note names: `c`, `bb`, `Bb`, `f#`, `c3`, `A4`, `Eb2`, `c#5`
   *
   * You can also use midi numbers instead of note names, where 69 is mapped to A4 440Hz in 12EDO.
   *
   * @name note
   * @example
   * note("c a f e")
   * @example
   * note("c4 a4 f4 e4")
   * @example
   * note("60 69 65 64")
   */
  [["note", "n"]],
  /**
   * A pattern of numbers that speed up (or slow down) samples while they play. Currently only supported by osc / superdirt.
   *
   * @name accelerate
   * @param {number | Pattern} amount acceleration.
   * @superdirtOnly
   * @example
   * s("sax").accelerate("<0 1 2 4 8 16>").slow(2).osc()
   *
   */
  ["accelerate"],
  /**
   * Controls the gain by an exponential amount.
   *
   * @name gain
   * @param {number | Pattern} amount gain.
   * @example
   * s("hh*8").gain(".4!2 1 .4!2 1 .4 1")
   *
   */
  ["gain"],
  /**
   * Like {@link gain}, but linear.
   *
   * @name amp
   * @param {number | Pattern} amount gain.
   * @superdirtOnly
   * @example
   * s("bd*8").amp(".1*2 .5 .1*2 .5 .1 .5").osc()
   *
   */
  ["amp"],
  /**
   * Amplitude envelope attack time: Specifies how long it takes for the sound to reach its peak value, relative to the onset.
   *
   * @name attack
   * @param {number | Pattern} attack time in seconds.
   * @synonyms att
   * @example
   * note("c3 e3").attack("<0 .1 .5>")
   *
   */
  ["attack", "att"],
  /**
   * Sets the Frequency Modulation Harmonicity Ratio.
   * Controls the timbre of the sound.
   * Whole numbers and simple ratios sound more natural,
   * while decimal numbers and complex ratios sound metallic.
   *
   * @name fmh
   * @param {number | Pattern} harmonicity
   * @example
   * note("c e g b").fm(4).fmh("<1 2 1.5 1.61>")
   *
   */
  [["fmh", "fmi"], "fmh"],
  /**
   * Sets the Frequency Modulation of the synth.
   * Controls the modulation index, which defines the brightness of the sound.
   *
   * @name fm
   * @param {number | Pattern} brightness modulation index
   * @synonyms fmi
   * @example
   * note("c e g b").fm("<0 1 2 8 32>")
   *
   */
  [["fmi", "fmh"], "fm"],
  /**
   * Select the sound bank to use. To be used together with `s`. The bank name (+ "_") will be prepended to the value of `s`.
   *
   * @name bank
   * @param {string | Pattern} bank the name of the bank
   * @example
   * s("bd sd").bank('RolandTR909') // = s("RolandTR909_bd RolandTR909_sd")
   *
   */
  ["bank"],
  /**
   * Amplitude envelope decay time: the time it takes after the attack time to reach the sustain level.
   * Note that the decay is only audible if the sustain value is lower than 1.
   *
   * @name decay
   * @param {number | Pattern} time decay time in seconds
   * @example
   * note("c3 e3").decay("<.1 .2 .3 .4>").sustain(0)
   *
   */
  ["decay"],
  /**
   * Amplitude envelope sustain level: The level which is reached after attack / decay, being sustained until the offset.
   *
   * @name sustain
   * @param {number | Pattern} gain sustain level between 0 and 1
   * @synonyms sus
   * @example
   * note("c3 e3").decay(.2).sustain("<0 .1 .4 .6 1>")
   *
   */
  ["sustain", "sus"],
  /**
   * Amplitude envelope release time: The time it takes after the offset to go from sustain level to zero.
   *
   * @name release
   * @param {number | Pattern} time release time in seconds
   * @synonyms rel
   * @example
   * note("c3 e3 g3 c4").release("<0 .1 .4 .6 1>/2")
   *
   */
  ["release", "rel"],
  ["hold"],
  // TODO: in tidal, it seems to be normalized
  /**
   * Sets the center frequency of the **b**and-**p**ass **f**ilter. When using mininotation, you
   * can also optionally supply the 'bpq' parameter separated by ':'.
   *
   * @name bpf
   * @param {number | Pattern} frequency center frequency
   * @synonyms bandf, bp
   * @example
   * s("bd sd,hh*3").bpf("<1000 2000 4000 8000>")
   *
   */
  [["bandf", "bandq"], "bpf", "bp"],
  // TODO: in tidal, it seems to be normalized
  /**
   * Sets the **b**and-**p**ass **q**-factor (resonance).
   *
   * @name bpq
   * @param {number | Pattern} q q factor
   * @synonyms bandq
   * @example
   * s("bd sd").bpf(500).bpq("<0 1 2 3>")
   *
   */
  // currently an alias of 'bandq' https://github.com/tidalcycles/strudel/issues/496
  // ['bpq'],
  ["bandq", "bpq"],
  /**
   * a pattern of numbers from 0 to 1. Skips the beginning of each sample, e.g. `0.25` to cut off the first quarter from each sample.
   *
   * @memberof Pattern
   * @name begin
   * @param {number | Pattern} amount between 0 and 1, where 1 is the length of the sample
   * @example
   * samples({ rave: 'rave/AREUREADY.wav' }, 'github:tidalcycles/Dirt-Samples/master/')
   * s("rave").begin("<0 .25 .5 .75>")
   *
   */
  ["begin"],
  /**
   * The same as .begin, but cuts off the end off each sample.
   *
   * @memberof Pattern
   * @name end
   * @param {number | Pattern} length 1 = whole sample, .5 = half sample, .25 = quarter sample etc..
   * @example
   * s("bd*2,oh*4").end("<.1 .2 .5 1>")
   *
   */
  ["end"],
  /**
   * Loops the sample (from `begin` to `end`) the specified number of times.
   * Note that the tempo of the loop is not synced with the cycle tempo.
   *
   * @name loop
   * @param {number | Pattern} times How often the sample is looped
   * @example
   * s("bd").loop("<1 2 3 4>").osc()
   *
   */
  ["loop"],
  // TODO: currently duplicated with "native" legato
  // TODO: superdirt legato will do more: https://youtu.be/dQPmE1WaD1k?t=419
  /**
   * a pattern of numbers from 0 to 1. Skips the beginning of each sample, e.g. `0.25` to cut off the first quarter from each sample.
   *
   * @name legato
   * @param {number | Pattern} duration between 0 and 1, where 1 is the length of the whole hap time
   * @noAutocomplete
   * @example
   * "c4 eb4 g4 bb4".legato("<0.125 .25 .5 .75 1 2 4>")
   *
   */
  // ['legato'],
  // ['clhatdecay'],
  /**
   * bit crusher effect.
   *
   * @name crush
   * @param {number | Pattern} depth between 1 (for drastic reduction in bit-depth) to 16 (for barely no reduction).
   * @example
   * s("<bd sd>,hh*3").fast(2).crush("<16 8 7 6 5 4 3 2>")
   *
   */
  ["crush"],
  /**
   * fake-resampling for lowering the sample rate. Caution: This effect seems to only work in chromium based browsers
   *
   * @name coarse
   * @param {number | Pattern} factor 1 for original 2 for half, 3 for a third and so on.
   * @example
   * s("bd sd,hh*4").coarse("<1 4 8 16 32>")
   *
   */
  ["coarse"],
  /**
   * choose the channel the pattern is sent to in superdirt
   *
   * @name channel
   * @param {number | Pattern} channel channel number
   *
   */
  ["channel"],
  /**
   * In the style of classic drum-machines, `cut` will stop a playing sample as soon as another samples with in same cutgroup is to be played. An example would be an open hi-hat followed by a closed one, essentially muting the open.
   *
   * @name cut
   * @param {number | Pattern} group cut group number
   * @example
   * s("rd*4").cut(1)
   *
   */
  ["cut"],
  /**
   * Applies the cutoff frequency of the **l**ow-**p**ass **f**ilter.
   *
   * When using mininotation, you can also optionally add the 'lpq' parameter, separated by ':'.
   *
   * @name lpf
   * @param {number | Pattern} frequency audible between 0 and 20000
   * @synonyms cutoff, ctf, lp
   * @example
   * s("bd sd,hh*3").lpf("<4000 2000 1000 500 200 100>")
   * @example
   * s("bd*8").lpf("1000:0 1000:10 1000:20 1000:30")
   *
   */
  [["cutoff", "resonance"], "ctf", "lpf", "lp"],
  /**
   * Applies the cutoff frequency of the **h**igh-**p**ass **f**ilter.
   *
   * When using mininotation, you can also optionally add the 'hpq' parameter, separated by ':'.
   *
   * @name hpf
   * @param {number | Pattern} frequency audible between 0 and 20000
   * @synonyms hp, hcutoff
   * @example
   * s("bd sd,hh*4").hpf("<4000 2000 1000 500 200 100>")
   * @example
   * s("bd sd,hh*4").hpf("<2000 2000:25>")
   *
   */
  // currently an alias of 'hcutoff' https://github.com/tidalcycles/strudel/issues/496
  // ['hpf'],
  [["hcutoff", "hresonance"], "hpf", "hp"],
  /**
   * Controls the **h**igh-**p**ass **q**-value.
   *
   * @name hpq
   * @param {number | Pattern} q resonance factor between 0 and 50
   * @synonyms hresonance
   * @example
   * s("bd sd,hh*4").hpf(2000).hpq("<0 10 20 30>")
   *
   */
  ["hresonance", "hpq"],
  /**
   * Controls the **l**ow-**p**ass **q**-value.
   *
   * @name lpq
   * @param {number | Pattern} q resonance factor between 0 and 50
   * @synonyms resonance
   * @example
   * s("bd sd,hh*4").lpf(2000).lpq("<0 10 20 30>")
   *
   */
  // currently an alias of 'resonance' https://github.com/tidalcycles/strudel/issues/496
  ["resonance", "lpq"],
  /**
   * DJ filter, below 0.5 is low pass filter, above is high pass filter.
   *
   * @name djf
   * @param {number | Pattern} cutoff below 0.5 is low pass filter, above is high pass filter
   * @example
   * n("0 3 7 [10,24]").s('superzow').octave(3).djf("<.5 .25 .5 .75>").osc()
   *
   */
  ["djf"],
  // ['cutoffegint'],
  // TODO: does not seem to work
  /**
   * Sets the level of the delay signal.
   *
   * When using mininotation, you can also optionally add the 'delaytime' and 'delayfeedback' parameter,
   * separated by ':'.
   *
   *
   * @name delay
   * @param {number | Pattern} level between 0 and 1
   * @example
   * s("bd").delay("<0 .25 .5 1>")
   * @example
   * s("bd bd").delay("0.65:0.25:0.9 0.65:0.125:0.7")
   *
   */
  [["delay", "delaytime", "delayfeedback"]],
  /**
   * Sets the level of the signal that is fed back into the delay.
   * Caution: Values >= 1 will result in a signal that gets louder and louder! Don't do it
   *
   * @name delayfeedback
   * @param {number | Pattern} feedback between 0 and 1
   * @synonyms delayfb, dfb
   * @example
   * s("bd").delay(.25).delayfeedback("<.25 .5 .75 1>").slow(2)
   *
   */
  ["delayfeedback", "delayfb", "dfb"],
  /**
   * Sets the time of the delay effect.
   *
   * @name delaytime
   * @param {number | Pattern} seconds between 0 and Infinity
   * @synonyms delayt, dt
   * @example
   * s("bd").delay(.25).delaytime("<.125 .25 .5 1>").slow(2)
   *
   */
  ["delaytime", "delayt", "dt"],
  /* // TODO: test
   * Specifies whether delaytime is calculated relative to cps.
   *
   * @name lock
   * @param {number | Pattern} enable When set to 1, delaytime is a direct multiple of a cycle.
   * @example
   * s("sd").delay().lock(1).osc()
   *
   */
  ["lock"],
  /**
   * Set detune of oscillators. Works only with some synths, see <a target="_blank" href="https://tidalcycles.org/docs/patternlib/tutorials/synthesizers">tidal doc</a>
   *
   * @name detune
   * @param {number | Pattern} amount between 0 and 1
   * @synonyms det
   * @superdirtOnly
   * @example
   * n("0 3 7").s('superzow').octave(3).detune("<0 .25 .5 1 2>").osc()
   *
   */
  ["detune", "det"],
  /**
   * Set dryness of reverb. See {@link room} and {@link size} for more information about reverb.
   *
   * @name dry
   * @param {number | Pattern} dry 0 = wet, 1 = dry
   * @example
   * n("[0,3,7](3,8)").s("superpiano").room(.7).dry("<0 .5 .75 1>").osc()
   * @superdirtOnly
   *
   */
  ["dry"],
  // TODO: does not seem to do anything
  /*
   * Used when using {@link begin}/{@link end} or {@link chop}/{@link striate} and friends, to change the fade out time of the 'grain' envelope.
   *
   * @name fadeTime
   * @param {number | Pattern} time between 0 and 1
   * @example
   * s("oh*4").end(.1).fadeTime("<0 .2 .4 .8>").osc()
   *
   */
  ["fadeTime", "fadeOutTime"],
  // TODO: see above
  ["fadeInTime"],
  /**
   * Set frequency of sound.
   *
   * @name freq
   * @param {number | Pattern} frequency in Hz. the audible range is between 20 and 20000 Hz
   * @example
   * freq("220 110 440 110").s("superzow").osc()
   * @example
   * freq("110".mul.out(".5 1.5 .6 [2 3]")).s("superzow").osc()
   *
   */
  ["freq"],
  // TODO: https://tidalcycles.org/docs/configuration/MIDIOSC/control-voltage/#gate
  ["gate", "gat"],
  // ['hatgrain'],
  // ['lagogo'],
  // ['lclap'],
  // ['lclaves'],
  // ['lclhat'],
  // ['lcrash'],
  // TODO:
  // https://tidalcycles.org/docs/reference/audio_effects/#leslie-1
  // https://tidalcycles.org/docs/reference/audio_effects/#leslie
  /**
   * Emulation of a Leslie speaker: speakers rotating in a wooden amplified cabinet.
   *
   * @name leslie
   * @param {number | Pattern} wet between 0 and 1
   * @example
   * n("0,4,7").s("supersquare").leslie("<0 .4 .6 1>").osc()
   * @superdirtOnly
   *
   */
  ["leslie"],
  /**
   * Rate of modulation / rotation for leslie effect
   *
   * @name lrate
   * @param {number | Pattern} rate 6.7 for fast, 0.7 for slow
   * @example
   * n("0,4,7").s("supersquare").leslie(1).lrate("<1 2 4 8>").osc()
   * @superdirtOnly
   *
   */
  // TODO: the rate seems to "lag" (in the example, 1 will be fast)
  ["lrate"],
  /**
   * Physical size of the cabinet in meters. Be careful, it might be slightly larger than your computer. Affects the Doppler amount (pitch warble)
   *
   * @name lsize
   * @param {number | Pattern} meters somewhere between 0 and 1
   * @example
   * n("0,4,7").s("supersquare").leslie(1).lrate(2).lsize("<.1 .5 1>").osc()
   * @superdirtOnly
   *
   */
  ["lsize"],
  // ['lfo'],
  // ['lfocutoffint'],
  // ['lfodelay'],
  // ['lfoint'],
  // ['lfopitchint'],
  // ['lfoshape'],
  // ['lfosync'],
  // ['lhitom'],
  // ['lkick'],
  // ['llotom'],
  // ['lophat'],
  // ['lsnare'],
  ["degree"],
  // TODO: what is this? not found in tidal doc
  ["mtranspose"],
  // TODO: what is this? not found in tidal doc
  ["ctranspose"],
  // TODO: what is this? not found in tidal doc
  ["harmonic"],
  // TODO: what is this? not found in tidal doc
  ["stepsPerOctave"],
  // TODO: what is this? not found in tidal doc
  ["octaveR"],
  // TODO: what is this? not found in tidal doc
  // TODO: why is this needed? what's the difference to late / early? Answer: it's in seconds, and delays the message at
  // OSC time (so can't be negative, at least not beyond the latency value)
  ["nudge"],
  // TODO: the following doc is just a guess, it's not documented in tidal doc.
  /**
   * Sets the default octave of a synth.
   *
   * @name octave
   * @param {number | Pattern} octave octave number
   * @example
   * n("0,4,7").s('supersquare').octave("<3 4 5 6>").osc()
   * @superDirtOnly
   */
  ["octave"],
  // ['ophatdecay'],
  // TODO: example
  /**
   * An `orbit` is a global parameter context for patterns. Patterns with the same orbit will share the same global effects.
   *
   * @name orbit
   * @param {number | Pattern} number
   * @example
   * stack(
   *   s("hh*3").delay(.5).delaytime(.25).orbit(1),
   *   s("~ sd").delay(.5).delaytime(.125).orbit(2)
   * )
   */
  ["orbit"],
  ["overgain"],
  // TODO: what is this? not found in tidal doc Answer: gain is limited to maximum of 2. This allows you to go over that
  ["overshape"],
  // TODO: what is this? not found in tidal doc. Similar to above, but limited to 1
  /**
   * Sets position in stereo.
   *
   * @name pan
   * @param {number | Pattern} pan between 0 and 1, from left to right (assuming stereo), once round a circle (assuming multichannel)
   * @example
   * s("[bd hh]*2").pan("<.5 1 .5 0>")
   *
   */
  ["pan"],
  // TODO: this has no effect (see example)
  /*
   * Controls how much multichannel output is fanned out
   *
   * @name panspan
   * @param {number | Pattern} span between -inf and inf, negative is backwards ordering
   * @example
   * s("[bd hh]*2").pan("<.5 1 .5 0>").panspan("<0 .5 1>").osc()
   *
   */
  ["panspan"],
  // TODO: this has no effect (see example)
  /*
   * Controls how much multichannel output is spread
   *
   * @name pansplay
   * @param {number | Pattern} spread between 0 and 1
   * @example
   * s("[bd hh]*2").pan("<.5 1 .5 0>").pansplay("<0 .5 1>").osc()
   *
   */
  ["pansplay"],
  ["panwidth"],
  ["panorient"],
  // ['pitch1'],
  // ['pitch2'],
  // ['pitch3'],
  // ['portamento'],
  // TODO: LFO rate see https://tidalcycles.org/docs/patternlib/tutorials/synthesizers/#supersquare
  ["rate"],
  // TODO: slide param for certain synths
  ["slide"],
  // TODO: detune? https://tidalcycles.org/docs/patternlib/tutorials/synthesizers/#supersquare
  ["semitone"],
  // TODO: dedup with synth param, see https://tidalcycles.org/docs/reference/synthesizers/#superpiano
  // ['velocity'],
  ["voice"],
  // TODO: synth param
  // voicings // https://github.com/tidalcycles/strudel/issues/506
  ["chord"],
  // chord to voice, like C Eb Fm7 G7. the symbols can be defined via addVoicings
  ["dictionary", "dict"],
  // which dictionary to use for the voicings
  ["anchor"],
  // the top note to align the voicing to, defaults to c5
  ["offset"],
  // how the voicing is offset from the anchored position
  ["octaves"],
  // how many octaves are voicing steps spread apart, defaults to 1
  [["mode", "anchor"]],
  // below = anchor note will be removed from the voicing, useful for melody harmonization
  /**
   * Sets the level of reverb.
   *
   * When using mininotation, you can also optionally add the 'size' parameter, separated by ':'.
   *
   * @name room
   * @param {number | Pattern} level between 0 and 1
   * @example
   * s("bd sd").room("<0 .2 .4 .6 .8 1>")
   * @example
   * s("bd sd").room("<0.9:1 0.9:4>")
   *
   */
  [["room", "size"]],
  /**
   * Sets the room size of the reverb, see {@link room}.
   *
   * @name roomsize
   * @param {number | Pattern} size between 0 and 10
   * @synonyms size, sz
   * @example
   * s("bd sd").room(.8).roomsize("<0 1 2 4 8>")
   *
   */
  // TODO: find out why :
  // s("bd sd").room(.8).roomsize("<0 .2 .4 .6 .8 [1,0]>").osc()
  // .. does not work. Is it because room is only one effect?
  ["size", "sz", "roomsize"],
  // ['sagogo'],
  // ['sclap'],
  // ['sclaves'],
  // ['scrash'],
  /**
   * Wave shaping distortion. CAUTION: it might get loud
   *
   * @name shape
   * @param {number | Pattern} distortion between 0 and 1
   * @example
   * s("bd sd,hh*4").shape("<0 .2 .4 .6 .8>")
   *
   */
  ["shape"],
  /**
   * Changes the speed of sample playback, i.e. a cheap way of changing pitch.
   *
   * @name speed
   * @param {number | Pattern} speed -inf to inf, negative numbers play the sample backwards.
   * @example
   * s("bd").speed("<1 2 4 1 -2 -4>")
   * @example
   * speed("1 1.5*2 [2 1.1]").s("piano").clip(1)
   *
   */
  ["speed"],
  /**
   * Used in conjunction with {@link speed}, accepts values of "r" (rate, default behavior), "c" (cycles), or "s" (seconds). Using `unit "c"` means `speed` will be interpreted in units of cycles, e.g. `speed "1"` means samples will be stretched to fill a cycle. Using `unit "s"` means the playback speed will be adjusted so that the duration is the number of seconds specified by `speed`.
   *
   * @name unit
   * @param {number | string | Pattern} unit see description above
   * @example
   * speed("1 2 .5 3").s("bd").unit("c").osc()
   * @superdirtOnly
   *
   */
  ["unit"],
  /**
   * Made by Calum Gunn. Reminiscent of some weird mixture of filter, ring-modulator and pitch-shifter. The SuperCollider manual defines Squiz as:
   *
   * "A simplistic pitch-raising algorithm. It's not meant to sound natural; its sound is reminiscent of some weird mixture of filter, ring-modulator and pitch-shifter, depending on the input. The algorithm works by cutting the signal into fragments (delimited by upwards-going zero-crossings) and squeezing those fragments in the time domain (i.e. simply playing them back faster than they came in), leaving silences inbetween. All the parameters apart from memlen can be modulated."
   *
   * @name squiz
   * @param {number | Pattern} squiz Try passing multiples of 2 to it - 2, 4, 8 etc.
   * @example
   * squiz("2 4/2 6 [8 16]").s("bd").osc()
   * @superdirtOnly
   *
   */
  ["squiz"],
  // ['stutterdepth'], // TODO: what is this? not found in tidal doc
  // ['stuttertime'], // TODO: what is this? not found in tidal doc
  // ['timescale'], // TODO: what is this? not found in tidal doc
  // ['timescalewin'], // TODO: what is this? not found in tidal doc
  // ['tomdecay'],
  // ['vcfegint'],
  // ['vcoegint'],
  // TODO: Use a rest (~) to override the effect <- vowel
  /**
   *
   * Formant filter to make things sound like vowels.
   *
   * @name vowel
   * @param {string | Pattern} vowel You can use a e i o u.
   * @example
   * note("c2 <eb2 <g2 g1>>").s('sawtooth')
   * .vowel("<a e i <o u>>")
   *
   */
  ["vowel"],
  /* // TODO: find out how it works
   * Made by Calum Gunn. Divides an audio stream into tiny segments, using the signal's zero-crossings as segment boundaries, and discards a fraction of them. Takes a number between 1 and 100, denoted the percentage of segments to drop. The SuperCollider manual describes the Waveloss effect this way:
   *
   * Divide an audio stream into tiny segments, using the signal's zero-crossings as segment boundaries, and discard a fraction of them (i.e. replace them with silence of the same length). The technique was described by Trevor Wishart in a lecture. Parameters: the filter drops drop out of out of chunks. mode can be 1 to drop chunks in a simple deterministic fashion (e.g. always dropping the first 30 out of a set of 40 segments), or 2 to drop chunks randomly but in an appropriate proportion.)
   *
   * mode: ?
   * waveloss: ?
   *
   * @name waveloss
   */
  ["waveloss"],
  // TODO: midi effects?
  ["dur"],
  // ['modwheel'],
  ["expression"],
  ["sustainpedal"],
  /* // TODO: doesn't seem to do anything
   *
   * Tremolo Audio DSP effect
   *
   * @name tremolodepth
   * @param {number | Pattern} depth between 0 and 1
   * @example
   * n("0,4,7").tremolodepth("<0 .3 .6 .9>").osc()
   *
   */
  ["tremolodepth", "tremdp"],
  ["tremolorate", "tremr"],
  // TODO: doesn't seem to do anything
  ["phaserdepth", "phasdp"],
  ["phaserrate", "phasr"],
  ["fshift"],
  ["fshiftnote"],
  ["fshiftphase"],
  ["triode"],
  ["krush"],
  ["kcutoff"],
  ["octer"],
  ["octersub"],
  ["octersubsub"],
  ["ring"],
  ["ringf"],
  ["ringdf"],
  ["distort"],
  ["freeze"],
  ["xsdelay"],
  ["tsdelay"],
  ["real"],
  ["imag"],
  ["enhance"],
  ["partials"],
  ["comb"],
  ["smear"],
  ["scram"],
  ["binshift"],
  ["hbrick"],
  ["lbrick"],
  ["midichan"],
  ["control"],
  ["ccn"],
  ["ccv"],
  ["polyTouch"],
  ["midibend"],
  ["miditouch"],
  ["ctlNum"],
  ["frameRate"],
  ["frames"],
  ["hours"],
  ["midicmd"],
  ["minutes"],
  ["progNum"],
  ["seconds"],
  ["songPtr"],
  ["uid"],
  ["val"],
  ["cps"],
  /**
   * Multiplies the duration with the given number. Also cuts samples off at the end if they exceed the duration.
   * In tidal, this would be done with legato, [which has a complicated history in strudel](https://github.com/tidalcycles/strudel/issues/111).
   * For now, if you're coming from tidal, just think clip = legato.
   *
   * @name clip
   * @param {number | Pattern} factor >= 0
   * @example
   * note("c a f e").s("piano").clip("<.5 1 2>")
   *
   */
  ["clip"]
];
controls.createParam = function(t) {
  const e = Array.isArray(t) ? t[0] : t;
  var n;
  Array.isArray(t) ? n = (i) => {
    if (Array.isArray(i)) {
      const a = {};
      return i.forEach((u, c) => {
        c < t.length && (a[t[c]] = u);
      }), a;
    } else
      return { [e]: i };
  } : n = (i) => ({ [e]: i });
  const o = (...i) => sequence(...i).withValue(n), s = function(...i) {
    return i.length ? this.set(o(...i)) : this.fmap(n);
  };
  return Pattern.prototype[e] = s, o;
};
generic_params.forEach(([t, ...e]) => {
  const n = Array.isArray(t) ? t[0] : t;
  controls[n] = controls.createParam(t), e.forEach((o) => {
    controls[o] = controls[n], Pattern.prototype[o] = Pattern.prototype[n];
  });
});
controls.createParams = (...t) => t.reduce((e, n) => Object.assign(e, { [n]: controls.createParam(n) }), {});
controls.adsr = register("adsr", (t, e) => {
  t = Array.isArray(t) ? t : [t];
  const [n, o, s, i] = t;
  return e.set({ attack: n, decay: o, sustain: s, release: i });
});
controls.ds = register("ds", (t, e) => {
  t = Array.isArray(t) ? t : [t];
  const [n, o] = t;
  return e.set({ decay: n, sustain: o });
});
const left = function(t, e) {
  const [n, o] = t, [s, i] = e, [a, u] = splitAt(o, s);
  return [
    [o, n - o],
    [zipWith((c, f) => c.concat(f), a, i), u]
  ];
}, right = function(t, e) {
  const [n, o] = t, [s, i] = e, [a, u] = splitAt(n, i);
  return [
    [n, o - n],
    [zipWith((f, l) => f.concat(l), s, a), u]
  ];
}, _bjork = function(t, e) {
  const [n, o] = t;
  return Math.min(n, o) <= 1 ? [t, e] : _bjork(...n > o ? left(t, e) : right(t, e));
}, bjork = function(t, e) {
  const n = e - t, o = Array(t).fill([1]), s = Array(n).fill([0]), i = _bjork([t, n], [o, s]);
  return flatten(i[1][0]).concat(flatten(i[1][1]));
}, _euclidRot = function(t, e, n) {
  const o = bjork(t, e);
  return n ? rotate(o, -n) : o;
}, euclid = register("euclid", function(t, e, n) {
  return n.struct(_euclidRot(t, e, 0));
}), { euclidrot, euclidRot } = register(["euclidrot", "euclidRot"], function(t, e, n, o) {
  return o.struct(_euclidRot(t, e, n));
}), _euclidLegato = function(t, e, n, o) {
  if (t < 1)
    return silence;
  const i = _euclidRot(t, e, n).join("").split("1").slice(1).map((a) => [a.length + 1, !0]);
  return o.struct(timeCat(...i));
}, euclidLegato = register(["euclidLegato"], function(t, e, n) {
  return _euclidLegato(t, e, 0, n);
}), euclidLegatoRot = register(["euclidLegatoRot"], function(t, e, n, o) {
  return _euclidLegato(t, e, n, o);
});
function steady(t) {
  return new Pattern((e) => [new Hap(void 0, e.span, t)]);
}
const signal = (t) => {
  const e = (n) => [new Hap(void 0, n.span, t(n.span.midpoint()))];
  return new Pattern(e);
}, isaw = signal((t) => 1 - t % 1), isaw2 = isaw.toBipolar(), saw = signal((t) => t % 1), saw2 = saw.toBipolar(), sine2 = signal((t) => Math.sin(Math.PI * 2 * t)), sine = sine2.fromBipolar(), cosine = sine._early(fraction(1).div(4)), cosine2 = sine2._early(fraction(1).div(4)), square = signal((t) => Math.floor(t * 2 % 2)), square2 = square.toBipolar(), tri = fastcat(isaw, saw), tri2 = fastcat(isaw2, saw2), time$1 = signal(id), xorwise = (t) => {
  const e = t << 13 ^ t, n = e >> 17 ^ e;
  return n << 5 ^ n;
}, _frac = (t) => t - Math.trunc(t), timeToIntSeed = (t) => xorwise(Math.trunc(_frac(t / 300) * 536870912)), intSeedToRand = (t) => t % 536870912 / 536870912, timeToRand = (t) => Math.abs(intSeedToRand(timeToIntSeed(t))), run = (t) => saw.range(0, t).floor().segment(t), rand = signal(timeToRand), rand2 = rand.toBipolar(), _brandBy = (t) => rand.fmap((e) => e < t), brandBy = (t) => reify(t).fmap(_brandBy).innerJoin(), brand = _brandBy(0.5), _irand = (t) => rand.fmap((e) => Math.trunc(e * t)), irand = (t) => reify(t).fmap(_irand).innerJoin(), __chooseWith = (t, e) => (e = e.map(reify), e.length == 0 ? silence : t.range(0, e.length).fmap((n) => e[Math.floor(n)])), chooseWith = (t, e) => __chooseWith(t, e).outerJoin(), chooseInWith = (t, e) => __chooseWith(t, e).innerJoin(), choose = (...t) => chooseWith(rand, t);
Pattern.prototype.choose = function(...t) {
  return chooseWith(this, t);
};
Pattern.prototype.choose2 = function(...t) {
  return chooseWith(this.fromBipolar(), t);
};
const chooseCycles = (...t) => chooseInWith(rand.segment(1), t), randcat = chooseCycles, _wchooseWith = function(t, ...e) {
  const n = e.map((u) => reify(u[0])), o = [];
  let s = 0;
  for (const u of e)
    s += u[1], o.push(s);
  const i = s, a = function(u) {
    const c = u * i;
    return n[o.findIndex((f) => f > c, o)];
  };
  return t.fmap(a);
}, wchooseWith = (...t) => _wchooseWith(...t).outerJoin(), wchoose = (...t) => wchooseWith(rand, ...t), wchooseCycles = (...t) => _wchooseWith(rand, ...t).innerJoin(), perlinWith = (t) => {
  const e = t.fmap(Math.floor), n = t.fmap((i) => Math.floor(i) + 1), o = (i) => 6 * i ** 5 - 15 * i ** 4 + 10 * i ** 3, s = (i) => (a) => (u) => a + o(i) * (u - a);
  return t.sub(e).fmap(s).appBoth(e.fmap(timeToRand)).appBoth(n.fmap(timeToRand));
}, perlin = perlinWith(time$1.fmap((t) => Number(t))), degradeByWith = register(
  "degradeByWith",
  (t, e, n) => n.fmap((o) => (s) => o).appLeft(t.filterValues((o) => o > e))
), degradeBy = register("degradeBy", function(t, e) {
  return e._degradeByWith(rand, t);
}), degrade = register("degrade", (t) => t._degradeBy(0.5)), undegradeBy = register("undegradeBy", function(t, e) {
  return e._degradeByWith(
    rand.fmap((n) => 1 - n),
    t
  );
}), undegrade = register("undegrade", (t) => t._undegradeBy(0.5)), sometimesBy = register("sometimesBy", function(t, e, n) {
  return reify(t).fmap((o) => stack(n._degradeBy(o), e(n._undegradeBy(1 - o)))).innerJoin();
}), sometimes = register("sometimes", function(t, e) {
  return e._sometimesBy(0.5, t);
}), someCyclesBy = register("someCyclesBy", function(t, e, n) {
  return reify(t).fmap(
    (o) => stack(
      n._degradeByWith(rand._segment(1), o),
      e(n._degradeByWith(rand.fmap((s) => 1 - s)._segment(1), 1 - o))
    )
  ).innerJoin();
}), someCycles = register("someCycles", function(t, e) {
  return e._someCyclesBy(0.5, t);
}), often = register("often", function(t, e) {
  return e.sometimesBy(0.75, t);
}), rarely = register("rarely", function(t, e) {
  return e.sometimesBy(0.25, t);
}), almostNever = register("almostNever", function(t, e) {
  return e.sometimesBy(0.1, t);
}), almostAlways = register("almostAlways", function(t, e) {
  return e.sometimesBy(0.9, t);
}), never = register("never", function(t, e) {
  return e;
}), always = register("always", function(t, e) {
  return t(e);
});
let synth;
try {
  synth = window?.speechSynthesis;
} catch {
  console.warn("cannot use window: not in browser?");
}
let allVoices = synth?.getVoices();
function triggerSpeech(t, e, n) {
  synth.cancel();
  const o = new SpeechSynthesisUtterance(t);
  o.lang = e, allVoices = synth.getVoices();
  const s = allVoices.filter((i) => i.lang.includes(e));
  typeof n == "number" ? o.voice = s[n % s.length] : typeof n == "string" && (o.voice = s.find((i) => i.name === i)), speechSynthesis.speak(o);
}
const speak = register("speak", function(t, e, n) {
  return n.onTrigger((o, s) => {
    triggerSpeech(s.value, t, e);
  });
}), evalScope = async (...t) => {
  const e = await Promise.allSettled(t), n = e.filter((o) => o.status === "fulfilled").map((o) => o.value);
  e.forEach((o, s) => {
    o.status === "rejected" && console.warn(`evalScope: module with index ${s} could not be loaded:`, o.reason);
  }), n.forEach((o) => {
    Object.entries(o).forEach(([s, i]) => {
      globalThis[s] = i;
    });
  });
};
function safeEval(t, e = {}) {
  const { wrapExpression: n = !0, wrapAsync: o = !0 } = e;
  n && (t = `{${t}}`), o && (t = `(async ()=>${t})()`);
  const s = `"use strict";return (${t})`;
  return Function(s)();
}
const evaluate = async (t, e) => {
  let n = {};
  if (e) {
    const i = e(t);
    t = i.output, n = i;
  }
  let s = await safeEval(t, { wrapExpression: !!e });
  if (!isPattern(s)) {
    console.log("evaluated", s);
    const i = `got "${typeof s}" instead of pattern`;
    throw new Error(i + (typeof s == "function" ? ", did you forget to call a function?" : "."));
  }
  return { mode: "javascript", pattern: s, meta: n };
};
function createClock(t, e, n = 0.05, o = 0.1, s = 0.1) {
  let i = 0, a = 0, u = 10 ** 4, c = 0.01;
  const f = (q) => n = q(n);
  s = s || o / 2;
  const l = () => {
    const q = t(), C = q + o + s;
    for (a === 0 && (a = q + c); a < C; )
      a = Math.round(a * u) / u, a >= q && e(a, n, i), a < q && console.log("TOO LATE", a), a += n, i++;
  };
  let p;
  const d = () => {
    m(), l(), p = setInterval(l, o * 1e3);
  }, m = () => p !== void 0 && clearInterval(p);
  return { setDuration: f, start: d, stop: () => {
    i = 0, a = 0, m();
  }, pause: () => m(), duration: n, interval: o, getPhase: () => a, minLatency: c };
}
class Cyclist {
  constructor({ interval: e, onTrigger: n, onToggle: o, onError: s, getTime: i, latency: a = 0.1 }) {
    this.started = !1, this.cps = 1, this.lastTick = 0, this.lastBegin = 0, this.lastEnd = 0, this.getTime = i, this.onToggle = o, this.latency = a;
    const u = (c) => Math.round(c * 1e3) / 1e3;
    this.clock = createClock(
      i,
      // called slightly before each cycle
      (c, f, l) => {
        l === 0 && (this.origin = c);
        try {
          const p = i(), d = this.lastEnd;
          this.lastBegin = d;
          const m = u(d + f * this.cps);
          this.lastEnd = m;
          const S = this.pattern.queryArc(d, m), k = c - p;
          this.lastTick = p + k, S.forEach((v) => {
            if (v.part.begin.equals(v.whole.begin)) {
              const q = (v.whole.begin - d) / this.cps + k + a, C = v.duration / this.cps;
              n?.(v, q, C, this.cps);
            }
          });
        } catch (p) {
          logger(`[cyclist] error: ${p.message}`), s?.(p);
        }
      },
      e
      // duration of each cycle
    );
  }
  now() {
    const e = this.getTime() - this.lastTick - this.clock.duration;
    return this.lastBegin + e * this.cps;
  }
  setStarted(e) {
    this.started = e, this.onToggle?.(e);
  }
  start() {
    if (!this.pattern)
      throw new Error("Scheduler: no pattern set! call .setPattern first.");
    logger("[cyclist] start"), this.clock.start(), this.setStarted(!0);
  }
  pause() {
    logger("[cyclist] pause"), this.clock.pause(), this.setStarted(!1);
  }
  stop() {
    logger("[cyclist] stop"), this.clock.stop(), this.lastEnd = 0, this.setStarted(!1);
  }
  setPattern(e, n = !1) {
    this.pattern = e, n && !this.started && this.start();
  }
  setCps(e = 1) {
    this.cps = e;
  }
  log(e, n, o) {
    const s = o.filter((i) => i.hasOnset());
    console.log(`${e.toFixed(4)} - ${n.toFixed(4)} ${Array(s.length).fill("I").join("")}`);
  }
}
let time;
function getTime() {
  if (!time)
    throw new Error("no time set! use setTime to define a time source");
  return time();
}
function setTime(t) {
  time = t;
}
function repl({
  interval: t,
  defaultOutput: e,
  onSchedulerError: n,
  onEvalError: o,
  beforeEval: s,
  afterEval: i,
  getTime: a,
  transpiler: u,
  onToggle: c,
  editPattern: f
}) {
  const l = new Cyclist({
    interval: t,
    onTrigger: getTrigger({ defaultOutput: e, getTime: a }),
    onError: n,
    getTime: a,
    onToggle: c
  }), p = (A, P = !0) => {
    A = f?.(A) || A, l.setPattern(A, P);
  };
  setTime(() => l.now());
  const d = async (A, P = !0) => {
    if (!A)
      throw new Error("no code to evaluate");
    try {
      await s?.({ code: A });
      let { pattern: T, meta: j } = await evaluate(A, u);
      return logger("[eval] code updated"), p(T, P), i?.({ code: A, pattern: T, meta: j }), T;
    } catch (T) {
      logger(`[eval] error: ${T.message}`, "error"), o?.(T);
    }
  }, m = () => l.stop(), S = () => l.start(), k = () => l.pause(), v = (A) => l.setCps(A), q = (A) => l.setCps(A / 60), C = register("loopAt", (A, P) => P.loopAtCps(A, l.cps)), b = register(
    "fit",
    (A) => A.withHap(
      (P) => P.withValue((T) => ({
        ...T,
        speed: l.cps / P.whole.duration,
        // overwrite speed completely?
        unit: "c"
      }))
    )
  );
  return evalScope({
    loopAt: C,
    fit: b,
    setCps: v,
    setcps: v,
    setCpm: q,
    setcpm: q
  }), { scheduler: l, evaluate: d, start: S, stop: m, pause: k, setCps: v, setPattern: p };
}
const getTrigger = ({ getTime: t, defaultOutput: e }) => async (n, o, s, i) => {
  try {
    (!n.context.onTrigger || !n.context.dominantTrigger) && await e(n, o, s, i), n.context.onTrigger && await n.context.onTrigger(t() + o, n, t(), i);
  } catch (a) {
    logger(`[cyclist] error: ${a.message}`, "error");
  }
}, getDrawContext = (t = "test-canvas") => {
  let e = document.querySelector("#" + t);
  if (!e) {
    e = document.createElement("canvas"), e.id = t, e.width = window.innerWidth, e.height = window.innerHeight, e.style = "pointer-events:none;width:100%;height:100%;position:fixed;top:0;left:0", document.body.prepend(e);
    let n;
    window.addEventListener("resize", () => {
      n && clearTimeout(n), n = setTimeout(() => {
        e.width = window.innerWidth, e.height = window.innerHeight;
      }, 200);
    });
  }
  return e.getContext("2d");
};
Pattern.prototype.draw = function(t, { from: e, to: n, onQuery: o }) {
  window.strudelAnimation && cancelAnimationFrame(window.strudelAnimation);
  const s = getDrawContext();
  let i, a = [];
  const u = (c) => {
    const f = getTime();
    if (e !== void 0 && n !== void 0) {
      const l = Math.floor(f);
      if (i !== l) {
        i = l;
        const p = l + e, d = l + n;
        setTimeout(() => {
          a = this.query(new State(new TimeSpan(p, d))).filter(Boolean).filter((m) => m.part.begin.equals(m.whole.begin)), o?.(a);
        }, 0);
      }
    }
    t(s, a, f, c), window.strudelAnimation = requestAnimationFrame(u);
  };
  return requestAnimationFrame(u), this;
};
const cleanupDraw = (t = !0) => {
  const e = getDrawContext();
  t && e.clearRect(0, 0, window.innerWidth, window.innerHeight), window.strudelAnimation && cancelAnimationFrame(window.strudelAnimation), window.strudelScheduler && clearInterval(window.strudelScheduler);
};
Pattern.prototype.onPaint = function(t) {
  return this.context = { onPaint: t }, this;
};
class Framer {
  constructor(e, n) {
    this.onFrame = e, this.onError = n;
  }
  start() {
    const e = this;
    let n = requestAnimationFrame(function o(s) {
      try {
        e.onFrame(s);
      } catch (i) {
        e.onError(i);
      }
      n = requestAnimationFrame(o);
    });
    e.cancel = () => {
      cancelAnimationFrame(n);
    };
  }
  stop() {
    this.cancel && this.cancel();
  }
}
class Drawer {
  constructor(e, n) {
    let [o, s] = n;
    o = Math.abs(o), this.visibleHaps = [], this.lastFrame = null, this.drawTime = n, this.framer = new Framer(
      () => {
        if (!this.scheduler) {
          console.warn("Drawer: no scheduler");
          return;
        }
        const i = this.scheduler.now() + s;
        if (this.lastFrame === null) {
          this.lastFrame = i;
          return;
        }
        const a = this.scheduler.pattern.queryArc(Math.max(this.lastFrame, i - 1 / 10), i);
        this.lastFrame = i, this.visibleHaps = (this.visibleHaps || []).filter((c) => c.whole.end >= i - o - s).concat(a.filter((c) => c.hasOnset()));
        const u = i - s;
        e(this.visibleHaps, u, this);
      },
      (i) => {
        console.warn("draw error", i);
      }
    );
  }
  invalidate(e = this.scheduler) {
    if (!e)
      return;
    this.scheduler = e;
    const n = e.now();
    let [o, s] = this.drawTime;
    const [i, a] = [Math.max(n, 0), n + s + 0.1];
    this.visibleHaps = this.visibleHaps.filter((c) => c.whole.begin < n);
    const u = e.pattern.queryArc(i, a);
    this.visibleHaps = this.visibleHaps.concat(u);
  }
  start(e) {
    this.scheduler = e, this.invalidate(), this.framer.start();
  }
  stop() {
    this.framer && this.framer.stop();
  }
}
const { createParams } = controls;
let clearColor = "#22222210";
Pattern.prototype.animate = function({ callback: t, sync: e = !1, smear: n = 0.5 } = {}) {
  window.frame && cancelAnimationFrame(window.frame);
  const o = getDrawContext(), { clientWidth: s, clientHeight: i } = o.canvas;
  let a = n === 0 ? "99" : Number((1 - n) * 100).toFixed(0);
  a = a.length === 1 ? `0${a}` : a, clearColor = `#200010${a}`;
  const u = (c) => {
    let f;
    c = Math.round(c), f = this.slow(1e3).queryArc(c, c), o.fillStyle = clearColor, o.fillRect(0, 0, s, i), f.forEach((l) => {
      let { x: p, y: d, w: m, h: S, s: k, r: v, angle: q = 0, fill: C = "darkseagreen" } = l.value;
      if (m *= s, S *= i, v !== void 0 && q !== void 0) {
        const A = q * 2 * Math.PI, [P, T] = [(s - m) / 2, (i - S) / 2];
        p = P + Math.cos(A) * v * P, d = T + Math.sin(A) * v * T;
      } else
        p *= s - m, d *= i - S;
      const b = { ...l.value, x: p, y: d, w: m, h: S };
      o.fillStyle = C, k === "rect" ? o.fillRect(p, d, m, S) : k === "ellipse" && (o.beginPath(), o.ellipse(p + m / 2, d + S / 2, m / 2, S / 2, 0, 0, 2 * Math.PI), o.fill()), t && t(o, b, l);
    }), window.frame = requestAnimationFrame(u);
  };
  return window.frame = requestAnimationFrame(u), silence;
};
const { x, y, w, h, angle, r, fill, smear } = createParams("x", "y", "w", "h", "angle", "r", "fill", "smear"), rescale = register("rescale", function(t, e) {
  return e.mul(x(t).w(t).y(t).h(t));
}), moveXY = register("moveXY", function(t, e, n) {
  return n.add(x(t).y(e));
}), zoomIn = register("zoomIn", function(t, e) {
  const n = pure(1).sub(t).div(2);
  return e.rescale(t).move(n, n);
}), scale = (t, e, n) => t * (n - e) + e, getValue = (t) => {
  let { value: e } = t;
  typeof t.value != "object" && (e = { value: e });
  let { note: n, n: o, freq: s, s: i } = e;
  return s ? freqToMidi(s) : (n = n ?? o, typeof n == "string" ? noteToMidi(n) : typeof n == "number" ? n : i ? "_" + i : e);
};
Pattern.prototype.pianoroll = function({
  cycles: t = 4,
  playhead: e = 0.5,
  overscan: n = 1,
  flipTime: o = 0,
  flipValues: s = 0,
  hideNegative: i = !1,
  // inactive = '#C9E597',
  // inactive = '#FFCA28',
  inactive: a = "#7491D2",
  active: u = "#FFCA28",
  // background = '#2A3236',
  background: c = "transparent",
  smear: f = 0,
  playheadColor: l = "white",
  minMidi: p = 10,
  maxMidi: d = 90,
  autorange: m = 0,
  timeframe: S,
  fold: k = 0,
  vertical: v = 0,
  labels: q = 0
} = {}) {
  const C = getDrawContext(), b = C.canvas.width, A = C.canvas.height;
  let P = -t * e, T = t * (1 - e);
  S && (console.warn("timeframe is deprecated! use from/to instead"), P = 0, T = S);
  const j = v ? A : b, O = v ? b : A;
  let F = v ? [j, 0] : [0, j];
  const R = T - P, H = v ? [0, O] : [O, 0];
  let I = d - p + 1, z = O / I, M = [];
  return o && F.reverse(), s && H.reverse(), this.draw(
    (_, J, L) => {
      _.fillStyle = c, _.globalAlpha = 1, f || (_.clearRect(0, 0, b, A), _.fillRect(0, 0, b, A));
      const Q = (g) => (!i || g.whole.begin >= 0) && g.whole.begin <= L + T && g.endClipped >= L + P;
      J.filter(Q).forEach((g) => {
        const W = g.whole.begin <= L && g.endClipped > L;
        _.fillStyle = g.context?.color || a, _.strokeStyle = g.context?.color || u, _.globalAlpha = g.context.velocity ?? g.value?.gain ?? 1;
        const $ = scale((g.whole.begin - (o ? T : P)) / R, ...F);
        let B = scale(g.duration / R, 0, j);
        const N = getValue(g), G = scale(
          k ? M.indexOf(N) / M.length : (Number(N) - p) / I,
          ...H
        );
        let U = 0;
        const K = scale(L / R, ...F);
        let D;
        if (v ? D = [
          G + 1 - (s ? z : 0),
          // x
          j - K + $ + U + 1 - (o ? 0 : B),
          // y
          z - 2,
          // width
          B - 2
          // height
        ] : D = [
          $ - K + U + 1 - (o ? B : 0),
          // x
          G + 1 - (s ? 0 : z),
          // y
          B - 2,
          // widith
          z - 2
          // height
        ], W ? _.strokeRect(...D) : _.fillRect(...D), q) {
          const V = g.value.note ?? g.value.s + (g.value.n ? `:${g.value.n}` : "");
          _.font = `${z * 0.75}px monospace`, _.strokeStyle = "black", _.fillStyle = W ? "white" : "black", _.textBaseline = "top", _.fillText(V, ...D);
        }
      }), _.globalAlpha = 1;
      const E = scale(-P / R, ...F);
      _.strokeStyle = l, _.beginPath(), v ? (_.moveTo(0, E), _.lineTo(O, E)) : (_.moveTo(E, 0), _.lineTo(E, O)), _.stroke();
    },
    {
      from: P - n,
      to: T + n,
      onQuery: (_) => {
        const { min: J, max: L, values: Q } = _.reduce(
          ({ min: E, max: g, values: W }, $) => {
            const B = getValue($);
            return {
              min: B < E ? B : E,
              max: B > g ? B : g,
              values: W.includes(B) ? W : [...W, B]
            };
          },
          { min: 1 / 0, max: -1 / 0, values: [] }
        );
        m && (p = J, d = L, I = d - p + 1), M = Q.sort((E, g) => String(E).localeCompare(String(g))), z = k ? O / M.length : O / I;
      }
    }
  ), this;
};
function pianoroll({
  time: t,
  haps: e,
  cycles: n = 4,
  playhead: o = 0.5,
  flipTime: s = 0,
  flipValues: i = 0,
  hideNegative: a = !1,
  // inactive = '#C9E597',
  // inactive = '#FFCA28',
  inactive: u = "#7491D2",
  active: c = "#FFCA28",
  // background = '#2A3236',
  background: f = "transparent",
  smear: l = 0,
  playheadColor: p = "white",
  minMidi: d = 10,
  maxMidi: m = 90,
  autorange: S = 0,
  timeframe: k,
  fold: v = 0,
  vertical: q = 0,
  labels: C = !1,
  ctx: b
} = {}) {
  const A = b.canvas.width, P = b.canvas.height;
  let T = -n * o, j = n * (1 - o);
  k && (console.warn("timeframe is deprecated! use from/to instead"), T = 0, j = k);
  const O = q ? P : A, F = q ? A : P;
  let R = q ? [O, 0] : [0, O];
  const H = j - T, I = q ? [0, F] : [F, 0];
  let z = m - d + 1, M = F / z, _ = [];
  s && R.reverse(), i && I.reverse();
  const { min: J, max: L, values: Q } = e.reduce(
    ({ min: g, max: W, values: $ }, B) => {
      const N = getValue(B);
      return {
        min: N < g ? N : g,
        max: N > W ? N : W,
        values: $.includes(N) ? $ : [...$, N]
      };
    },
    { min: 1 / 0, max: -1 / 0, values: [] }
  );
  S && (d = J, m = L, z = m - d + 1), _ = Q.sort((g, W) => String(g).localeCompare(String(W))), M = v ? F / _.length : F / z, b.fillStyle = f, b.globalAlpha = 1, l || (b.clearRect(0, 0, A, P), b.fillRect(0, 0, A, P)), e.forEach((g) => {
    const W = g.whole.begin <= t && g.endClipped > t, $ = g.value?.color || g.context?.color;
    b.fillStyle = $ || u, b.strokeStyle = $ || c, b.globalAlpha = g.context.velocity ?? g.value?.gain ?? 1;
    const B = scale((g.whole.begin - (s ? j : T)) / H, ...R);
    let N = scale(g.duration / H, 0, O);
    const G = getValue(g), U = scale(
      v ? _.indexOf(G) / _.length : (Number(G) - d) / z,
      ...I
    );
    let K = 0;
    const D = scale(t / H, ...R);
    let V;
    if (q ? V = [
      U + 1 - (i ? M : 0),
      // x
      O - D + B + K + 1 - (s ? 0 : N),
      // y
      M - 2,
      // width
      N - 2
      // height
    ] : V = [
      B - D + K + 1 - (s ? N : 0),
      // x
      U + 1 - (i ? 0 : M),
      // y
      N - 2,
      // widith
      M - 2
      // height
    ], W ? b.strokeRect(...V) : b.fillRect(...V), C) {
      const X = g.value.note ?? g.value.s + (g.value.n ? `:${g.value.n}` : "");
      b.font = `${M * 0.75}px monospace`, b.strokeStyle = "black", b.fillStyle = W ? "white" : "black", b.textBaseline = "top", b.fillText(X, ...V);
    }
  }), b.globalAlpha = 1;
  const E = scale(-T / H, ...R);
  return b.strokeStyle = p, b.beginPath(), q ? (b.moveTo(0, E), b.lineTo(F, E)) : (b.moveTo(E, 0), b.lineTo(E, F)), b.stroke(), this;
}
function getDrawOptions(t, e = {}) {
  let [n, o] = t;
  n = Math.abs(n);
  const s = o + n, i = n / s;
  return { fold: 1, ...e, cycles: s, playhead: i };
}
Pattern.prototype.punchcard = function(t) {
  return this.onPaint(
    (e, n, o, s) => pianoroll({ ctx: e, time: n, haps: o, ...getDrawOptions(s, t) })
  );
};
function drawPianoroll(t) {
  const { drawTime: e, ...n } = t;
  pianoroll({ ...getDrawOptions(e), ...n });
}
function fromPolar(t, e, n, o) {
  const s = (t - 90) * Math.PI / 180;
  return [n + Math.cos(s) * e, o + Math.sin(s) * e];
}
const xyOnSpiral = (t, e, n, o, s = 0) => fromPolar((t + s) * 360, e * t, n, o);
function spiralSegment(t) {
  let {
    ctx: e,
    from: n = 0,
    to: o = 3,
    margin: s = 50,
    cx: i = 100,
    cy: a = 100,
    rotate: u = 0,
    thickness: c = s / 2,
    color: f = "#0000ff30",
    cap: l = "round",
    stretch: p = 1,
    fromOpacity: d = 1,
    toOpacity: m = 1
  } = t;
  n *= p, o *= p, u *= p, e.lineWidth = c, e.lineCap = l, e.strokeStyle = f, e.globalAlpha = d, e.beginPath();
  let [S, k] = xyOnSpiral(n, s, i, a, u);
  e.moveTo(S, k);
  const v = 1 / 60;
  let q = n;
  for (; q <= o; ) {
    const [C, b] = xyOnSpiral(q, s, i, a, u);
    e.globalAlpha = (q - n) / (o - n) * m, e.lineTo(C, b), q += v;
  }
  e.stroke();
}
Pattern.prototype.spiral = function(t = {}) {
  const {
    stretch: e = 1,
    size: n = 80,
    thickness: o = n / 2,
    cap: s = "butt",
    // round butt squar,
    inset: i = 3,
    // start angl,
    playheadColor: a = "#ffffff90",
    playheadLength: u = 0.02,
    playheadThickness: c = o,
    padding: f = 0,
    steady: l = 1,
    inactiveColor: p = "#ffffff20",
    colorizeInactive: d = 0,
    fade: m = !0
    // logSpiral = true,
  } = t;
  function S({ ctx: k, time: v, haps: q, drawTime: C }) {
    const [b, A] = [k.canvas.width, k.canvas.height];
    k.clearRect(0, 0, b * 2, A * 2);
    const [P, T] = [b / 2, A / 2], j = {
      margin: n / e,
      cx: P,
      cy: T,
      stretch: e,
      cap: s,
      thickness: o
    }, O = {
      ...j,
      thickness: c,
      from: i - u,
      to: i,
      color: a
    }, [F] = C, R = l * v;
    q.forEach((H) => {
      const I = H.whole.begin <= v && H.endClipped > v, z = H.whole.begin - v + i, M = H.endClipped - v + i - f, { color: _ } = H.context, J = m ? 1 - Math.abs((H.whole.begin - v) / F) : 1;
      spiralSegment({
        ctx: k,
        ...j,
        from: z,
        to: M,
        rotate: R,
        color: d || I ? _ : p,
        fromOpacity: J,
        toOpacity: J
      });
    }), spiralSegment({
      ctx: k,
      ...O,
      rotate: R
    });
  }
  return this.onPaint((k, v, q, C) => S({ ctx: k, time: v, haps: q, drawTime: C }));
};
function frame(t) {
  window.strudelAnimation && cancelAnimationFrame(window.strudelAnimation);
  const e = (n) => {
    t(n, getTime()), window.strudelAnimation = requestAnimationFrame(e);
  };
  requestAnimationFrame(e);
}
const backgroundImage = function(t, e = {}) {
  const n = document.getElementById("code"), o = "background-image:url(" + t + ");background-size:contain;";
  n.style = o;
  const { className: s } = n, i = (c, f) => {
    ({
      style: () => n.style = o + ";" + f,
      className: () => n.className = f + " " + s
    })[c]();
  }, a = Object.entries(e).filter(([c, f]) => typeof f == "function");
  Object.entries(e).filter(([c, f]) => typeof f == "string").forEach(([c, f]) => i(c, f)), a.length !== 0 && frame(
    (c, f) => a.forEach(([l, p]) => {
      i(l, p(f));
    })
  );
}, cleanupUi = () => {
  const t = document.getElementById("code");
  t && (t.style = "", t.className = "grow flex text-gray-100 relative overflow-auto cursor-text pb-0");
}, gist = (route, cache = !0) => fetch(`https://gist.githubusercontent.com/${route}?cachebust=${cache ? "" : Date.now()}`).then((t) => t.text()).then((code) => eval(code));
logger("🌀 @strudel.cycles/core loaded 🌀");
globalThis._strudelLoaded && console.warn(
  `@strudel.cycles/core was loaded more than once...
This might happen when you have multiple versions of strudel installed. 
Please check with "npm ls @strudel.cycles/core".`
);
globalThis._strudelLoaded = !0;
export {
  Cyclist,
  Drawer,
  fraction as Fraction,
  Framer,
  Hap,
  Pattern,
  State,
  TimeSpan,
  __chooseWith,
  _brandBy,
  _irand,
  _mod,
  add,
  almostAlways,
  almostNever,
  always,
  and,
  angle,
  apply,
  arrange,
  backgroundImage,
  band,
  bjork,
  blshift,
  bor,
  brak,
  brand,
  brandBy,
  brshift,
  bxor,
  bypass,
  cat,
  ceil,
  choose,
  chooseCycles,
  chooseInWith,
  chooseWith,
  chop,
  chunk,
  chunkBack,
  chunkback,
  clamp,
  cleanupDraw,
  cleanupUi,
  color,
  colour,
  compose,
  compress,
  compressSpan,
  compressspan,
  constant,
  controls,
  cosine,
  cosine2,
  cpm,
  curry,
  degrade,
  degradeBy,
  degradeByWith,
  density,
  div,
  drawLine,
  drawPianoroll,
  duration,
  early,
  echo,
  echoWith,
  echowith,
  eq,
  eqt,
  euclid,
  euclidLegato,
  euclidLegatoRot,
  euclidRot,
  euclidrot,
  evalScope,
  evaluate,
  every,
  fast,
  fastGap,
  fastcat,
  fastgap,
  fill,
  firstOf,
  fit,
  flatten,
  floor,
  focus,
  focusSpan,
  focusspan,
  fractionalArgs,
  freqToMidi,
  fromBipolar,
  func,
  getDrawContext,
  getDrawOptions,
  getFreq,
  getFrequency,
  getPlayableNoteValue,
  getTime,
  getTrigger,
  gist,
  gt,
  gte,
  h,
  hurry,
  hush,
  id,
  inside,
  inv,
  invert,
  irand,
  isNote,
  isNoteWithOctave,
  isPattern,
  isaw,
  isaw2,
  iter,
  iterBack,
  iterback,
  jux,
  juxBy,
  juxby,
  keep,
  keepif,
  lastOf,
  late,
  legato,
  linger,
  listRange,
  logKey,
  logger,
  loopAt,
  loopAtCps,
  loopat,
  loopatcps,
  lt,
  lte,
  mapArgs,
  mask,
  midi2note,
  midiToFreq,
  mod,
  moveXY,
  mul,
  ne,
  net,
  never,
  noteToMidi,
  numeralArgs,
  off,
  often,
  or,
  outside,
  palindrome,
  parseFractional,
  parseNumeral,
  perlin,
  perlinWith,
  pianoroll,
  pipe,
  ply,
  pm,
  polymeter,
  polymeterSteps,
  polyrhythm,
  pow,
  pr,
  press,
  pressBy,
  pure,
  r,
  rand,
  rand2,
  randcat,
  range,
  range2,
  rangex,
  rarely,
  ratio,
  register,
  reify,
  removeUndefineds,
  repl,
  rescale,
  rev,
  ribbon,
  rotate,
  round,
  run,
  saw,
  saw2,
  segment,
  seq,
  sequence,
  set,
  setStringParser,
  setTime,
  signal,
  silence,
  sine,
  sine2,
  slice,
  slow,
  slowcat,
  slowcatPrime,
  smear,
  sol2note,
  someCycles,
  someCyclesBy,
  sometimes,
  sometimesBy,
  sparsity,
  speak,
  splice,
  splitAt,
  square,
  square2,
  stack,
  steady,
  striate,
  struct,
  stut,
  stutWith,
  stutwith,
  sub,
  superimpose,
  time$1 as time,
  timeCat,
  toBipolar,
  tokenizeNote,
  tri,
  tri2,
  undegrade,
  undegradeBy,
  valueToMidi,
  velocity,
  w,
  wchoose,
  wchooseCycles,
  when,
  x,
  y,
  zipWith,
  zoom,
  zoomArc,
  zoomIn,
  zoomarc
};
