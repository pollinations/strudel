import * as A from "@strudel.cycles/core";
function _t(a, c) {
  function r() {
    this.constructor = a;
  }
  r.prototype = c.prototype, a.prototype = new r();
}
function O(a, c, r, h) {
  var m = Error.call(this, a);
  return Object.setPrototypeOf && Object.setPrototypeOf(m, O.prototype), m.expected = c, m.found = r, m.location = h, m.name = "SyntaxError", m;
}
_t(O, Error);
function K(a, c, r) {
  return r = r || " ", a.length > c ? a : (c -= a.length, r += r.repeat(c), a + r.slice(0, c));
}
O.prototype.format = function(a) {
  var c = "Error: " + this.message;
  if (this.location) {
    var r = null, h;
    for (h = 0; h < a.length; h++)
      if (a[h].source === this.location.source) {
        r = a[h].text.split(/\r\n|\n|\r/g);
        break;
      }
    var m = this.location.start, _ = this.location.source && typeof this.location.source.offset == "function" ? this.location.source.offset(m) : m, C = this.location.source + ":" + _.line + ":" + _.column;
    if (r) {
      var w = this.location.end, b = K("", _.line.toString().length, " "), p = r[m.line - 1], g = m.line === w.line ? w.column : p.length + 1, y = g - m.column || 1;
      c += `
 --> ` + C + `
` + b + ` |
` + _.line + " | " + p + `
` + b + " | " + K("", m.column - 1, " ") + K("", y, "^");
    } else
      c += `
 at ` + C;
  }
  return c;
};
O.buildMessage = function(a, c) {
  var r = {
    literal: function(p) {
      return '"' + m(p.text) + '"';
    },
    class: function(p) {
      var g = p.parts.map(function(y) {
        return Array.isArray(y) ? _(y[0]) + "-" + _(y[1]) : _(y);
      });
      return "[" + (p.inverted ? "^" : "") + g.join("") + "]";
    },
    any: function() {
      return "any character";
    },
    end: function() {
      return "end of input";
    },
    other: function(p) {
      return p.description;
    }
  };
  function h(p) {
    return p.charCodeAt(0).toString(16).toUpperCase();
  }
  function m(p) {
    return p.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\0/g, "\\0").replace(/\t/g, "\\t").replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/[\x00-\x0F]/g, function(g) {
      return "\\x0" + h(g);
    }).replace(/[\x10-\x1F\x7F-\x9F]/g, function(g) {
      return "\\x" + h(g);
    });
  }
  function _(p) {
    return p.replace(/\\/g, "\\\\").replace(/\]/g, "\\]").replace(/\^/g, "\\^").replace(/-/g, "\\-").replace(/\0/g, "\\0").replace(/\t/g, "\\t").replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/[\x00-\x0F]/g, function(g) {
      return "\\x0" + h(g);
    }).replace(/[\x10-\x1F\x7F-\x9F]/g, function(g) {
      return "\\x" + h(g);
    });
  }
  function C(p) {
    return r[p.type](p);
  }
  function w(p) {
    var g = p.map(C), y, x;
    if (g.sort(), g.length > 0) {
      for (y = 1, x = 1; y < g.length; y++)
        g[y - 1] !== g[y] && (g[x] = g[y], x++);
      g.length = x;
    }
    switch (g.length) {
      case 1:
        return g[0];
      case 2:
        return g[0] + " or " + g[1];
      default:
        return g.slice(0, -1).join(", ") + ", or " + g[g.length - 1];
    }
  }
  function b(p) {
    return p ? '"' + m(p) + '"' : "end of input";
  }
  return "Expected " + w(a) + " but " + b(c) + " found.";
};
function dt(a, c) {
  c = c !== void 0 ? c : {};
  var r = {}, h = c.grammarSource, m = { start: be }, _ = be, C = ".", w = "-", b = "+", p = "0", g = ",", y = "|", x = '"', Ie = "'", Oe = "#", qe = "^", Ne = "_", Q = "[", V = "]", Te = "{", Be = "}", ze = "%", Me = "<", We = ">", Ze = "@", Ge = "!", Ue = "(", Xe = ")", He = "/", Je = "*", Ke = "?", Qe = ":", Y = "struct", ee = "target", re = "euclid", se = "slow", te = "rotL", ne = "rotR", ae = "fast", ie = "scale", fe = "//", oe = "cat", Ve = "$", ce = "setcps", le = "setbpm", ue = "hush", Ye = /^[1-9]/, er = /^[eE]/, rr = /^[0-9]/, pe = /^[ \n\r\t]/, sr = /^[0-9a-zA-Z~]/, ge = /^[^\n]/, tr = Ae("number"), ve = $(".", !1), nr = P([["1", "9"]], !1, !1), ar = P(["e", "E"], !1, !1), $e = $("-", !1), ir = $("+", !1), fr = $("0", !1), or = P([["0", "9"]], !1, !1), cr = Ae("whitespace"), he = P([" ", `
`, "\r", "	"], !1, !1), lr = $(",", !1), ur = $("|", !1), pr = $('"', !1), gr = $("'", !1), vr = P([["0", "9"], ["a", "z"], ["A", "Z"], "~"], !1, !1), $r = $("#", !1), hr = $("^", !1), mr = $("_", !1), me = $("[", !1), _e = $("]", !1), _r = $("{", !1), dr = $("}", !1), wr = $("%", !1), yr = $("<", !1), Ar = $(">", !1), Cr = $("@", !1), br = $("!", !1), xr = $("(", !1), Er = $(")", !1), Fr = $("/", !1), Sr = $("*", !1), jr = $("?", !1), Pr = $(":", !1), kr = $("struct", !1), Rr = $("target", !1), Lr = $("euclid", !1), Dr = $("slow", !1), Ir = $("rotL", !1), Or = $("rotR", !1), qr = $("fast", !1), Nr = $("scale", !1), Tr = $("//", !1), de = P([`
`], !0, !1), Br = $("cat", !1), zr = $("$", !1), Mr = $("setcps", !1), Wr = $("setbpm", !1), Zr = $("hush", !1), Gr = function() {
    return parseFloat(Fs());
  }, Ur = function(e) {
    return new $t(e.join(""));
  }, Xr = function(e) {
    return e;
  }, Hr = function(e, s) {
    return e.arguments_.stepsPerCycle = s, e;
  }, Jr = function(e) {
    return e;
  }, Kr = function(e) {
    return e.arguments_.alignment = "slowcat", e;
  }, Qr = function(e) {
    return (s) => s.options_.weight = e;
  }, Vr = function(e) {
    return (s) => s.options_.reps = e;
  }, Yr = function(e, s, n) {
    return (i) => i.options_.ops.push({ type_: "bjorklund", arguments_: { pulse: e, step: s, rotation: n } });
  }, es = function(e) {
    return (s) => s.options_.ops.push({ type_: "stretch", arguments_: { amount: e, type: "slow" } });
  }, rs = function(e) {
    return (s) => s.options_.ops.push({ type_: "stretch", arguments_: { amount: e, type: "fast" } });
  }, ss = function(e) {
    return (s) => s.options_.ops.push({ type_: "degradeBy", arguments_: { amount: e, seed: ke++ } });
  }, ts = function(e) {
    return (s) => s.options_.ops.push({ type_: "tail", arguments_: { element: e } });
  }, ns = function(e, s) {
    const n = new mt(e, { ops: [], weight: 1, reps: 1 });
    for (const i of s)
      i(n);
    return n;
  }, as = function(e) {
    return new Z(e, "fastcat");
  }, is = function(e) {
    return { alignment: "stack", list: e };
  }, fs = function(e) {
    return { alignment: "rand", list: e, seed: ke++ };
  }, os = function(e, s) {
    return s && s.list.length > 0 ? new Z([e, ...s.list], s.alignment, s.seed) : e;
  }, cs = function(e, s) {
    return new Z(s ? [e, ...s.list] : [e], "polymeter");
  }, ls = function(e) {
    return e;
  }, us = function(e) {
    return { name: "struct", args: { mini: e } };
  }, ps = function(e) {
    return { name: "target", args: { name: e } };
  }, gs = function(e, s, n) {
    return { name: "bjorklund", args: { pulse: e, step: parseInt(s) } };
  }, vs = function(e) {
    return { name: "stretch", args: { amount: e } };
  }, $s = function(e) {
    return { name: "shift", args: { amount: "-" + e } };
  }, hs = function(e) {
    return { name: "shift", args: { amount: e } };
  }, ms = function(e) {
    return { name: "stretch", args: { amount: "1/" + e } };
  }, _s = function(e) {
    return { name: "scale", args: { scale: e.join("") } };
  }, we = function(e, s) {
    return s;
  }, ds = function(e, s) {
    return s.unshift(e), new Z(s, "slowcat");
  }, ws = function(e) {
    return e;
  }, ys = function(e, s) {
    return new ht(e.name, e.args, s);
  }, As = function(e) {
    return e;
  }, Cs = function(e) {
    return e;
  }, bs = function(e) {
    return new J("setcps", { value: e });
  }, xs = function(e) {
    return new J("setcps", { value: e / 120 / 2 });
  }, Es = function() {
    return new J("hush");
  }, t = 0, v = 0, B = [{ line: 1, column: 1 }], F = 0, U = [], f = 0, z;
  if ("startRule" in c) {
    if (!(c.startRule in m))
      throw new Error(`Can't start parsing from rule "` + c.startRule + '".');
    _ = m[c.startRule];
  }
  function Fs() {
    return a.substring(v, t);
  }
  function ye() {
    return X(v, t);
  }
  function $(e, s) {
    return { type: "literal", text: e, ignoreCase: s };
  }
  function P(e, s, n) {
    return { type: "class", parts: e, inverted: s, ignoreCase: n };
  }
  function Ss() {
    return { type: "end" };
  }
  function Ae(e) {
    return { type: "other", description: e };
  }
  function Ce(e) {
    var s = B[e], n;
    if (s)
      return s;
    for (n = e - 1; !B[n]; )
      n--;
    for (s = B[n], s = {
      line: s.line,
      column: s.column
    }; n < e; )
      a.charCodeAt(n) === 10 ? (s.line++, s.column = 1) : s.column++, n++;
    return B[e] = s, s;
  }
  function X(e, s, n) {
    var i = Ce(e), l = Ce(s), d = {
      source: h,
      start: {
        offset: e,
        line: i.line,
        column: i.column
      },
      end: {
        offset: s,
        line: l.line,
        column: l.column
      }
    };
    return n && h && typeof h.offset == "function" && (d.start = h.offset(d.start), d.end = h.offset(d.end)), d;
  }
  function o(e) {
    t < F || (t > F && (F = t, U = []), U.push(e));
  }
  function js(e, s, n) {
    return new O(
      O.buildMessage(e, s),
      e,
      s,
      n
    );
  }
  function be() {
    var e;
    return e = vt(), e;
  }
  function S() {
    var e, s;
    return f++, e = t, xe(), s = M(), s !== r ? (Ds(), Ls(), v = e, e = Gr()) : (t = e, e = r), f--, e === r && f === 0 && o(tr), e;
  }
  function Ps() {
    var e;
    return a.charCodeAt(t) === 46 ? (e = C, t++) : (e = r, f === 0 && o(ve)), e;
  }
  function ks() {
    var e;
    return Ye.test(a.charAt(t)) ? (e = a.charAt(t), t++) : (e = r, f === 0 && o(nr)), e;
  }
  function Rs() {
    var e;
    return er.test(a.charAt(t)) ? (e = a.charAt(t), t++) : (e = r, f === 0 && o(ar)), e;
  }
  function Ls() {
    var e, s, n, i, l;
    if (e = t, s = Rs(), s !== r) {
      if (n = xe(), n === r && (n = Is()), n === r && (n = null), i = [], l = k(), l !== r)
        for (; l !== r; )
          i.push(l), l = k();
      else
        i = r;
      i !== r ? (s = [s, n, i], e = s) : (t = e, e = r);
    } else
      t = e, e = r;
    return e;
  }
  function Ds() {
    var e, s, n, i;
    if (e = t, s = Ps(), s !== r) {
      if (n = [], i = k(), i !== r)
        for (; i !== r; )
          n.push(i), i = k();
      else
        n = r;
      n !== r ? (s = [s, n], e = s) : (t = e, e = r);
    } else
      t = e, e = r;
    return e;
  }
  function M() {
    var e, s, n, i;
    if (e = Os(), e === r)
      if (e = t, s = ks(), s !== r) {
        for (n = [], i = k(); i !== r; )
          n.push(i), i = k();
        s = [s, n], e = s;
      } else
        t = e, e = r;
    return e;
  }
  function xe() {
    var e;
    return a.charCodeAt(t) === 45 ? (e = w, t++) : (e = r, f === 0 && o($e)), e;
  }
  function Is() {
    var e;
    return a.charCodeAt(t) === 43 ? (e = b, t++) : (e = r, f === 0 && o(ir)), e;
  }
  function Os() {
    var e;
    return a.charCodeAt(t) === 48 ? (e = p, t++) : (e = r, f === 0 && o(fr)), e;
  }
  function k() {
    var e;
    return rr.test(a.charAt(t)) ? (e = a.charAt(t), t++) : (e = r, f === 0 && o(or)), e;
  }
  function u() {
    var e, s;
    for (f++, e = [], pe.test(a.charAt(t)) ? (s = a.charAt(t), t++) : (s = r, f === 0 && o(he)); s !== r; )
      e.push(s), pe.test(a.charAt(t)) ? (s = a.charAt(t), t++) : (s = r, f === 0 && o(he));
    return f--, s = r, f === 0 && o(cr), e;
  }
  function R() {
    var e, s, n, i;
    return e = t, s = u(), a.charCodeAt(t) === 44 ? (n = g, t++) : (n = r, f === 0 && o(lr)), n !== r ? (i = u(), s = [s, n, i], e = s) : (t = e, e = r), e;
  }
  function Ee() {
    var e, s, n, i;
    return e = t, s = u(), a.charCodeAt(t) === 124 ? (n = y, t++) : (n = r, f === 0 && o(ur)), n !== r ? (i = u(), s = [s, n, i], e = s) : (t = e, e = r), e;
  }
  function L() {
    var e;
    return a.charCodeAt(t) === 34 ? (e = x, t++) : (e = r, f === 0 && o(pr)), e === r && (a.charCodeAt(t) === 39 ? (e = Ie, t++) : (e = r, f === 0 && o(gr))), e;
  }
  function W() {
    var e;
    return sr.test(a.charAt(t)) ? (e = a.charAt(t), t++) : (e = r, f === 0 && o(vr)), e === r && (a.charCodeAt(t) === 45 ? (e = w, t++) : (e = r, f === 0 && o($e)), e === r && (a.charCodeAt(t) === 35 ? (e = Oe, t++) : (e = r, f === 0 && o($r)), e === r && (a.charCodeAt(t) === 46 ? (e = C, t++) : (e = r, f === 0 && o(ve)), e === r && (a.charCodeAt(t) === 94 ? (e = qe, t++) : (e = r, f === 0 && o(hr)), e === r && (a.charCodeAt(t) === 95 ? (e = Ne, t++) : (e = r, f === 0 && o(mr))))))), e;
  }
  function Fe() {
    var e, s, n;
    if (e = t, u(), s = [], n = W(), n !== r)
      for (; n !== r; )
        s.push(n), n = W();
    else
      s = r;
    return s !== r ? (n = u(), v = e, e = Ur(s)) : (t = e, e = r), e;
  }
  function qs() {
    var e, s, n, i;
    return e = t, u(), a.charCodeAt(t) === 91 ? (s = Q, t++) : (s = r, f === 0 && o(me)), s !== r ? (u(), n = Pe(), n !== r ? (u(), a.charCodeAt(t) === 93 ? (i = V, t++) : (i = r, f === 0 && o(_e)), i !== r ? (u(), v = e, e = Xr(n)) : (t = e, e = r)) : (t = e, e = r)) : (t = e, e = r), e;
  }
  function Ns() {
    var e, s, n, i, l;
    return e = t, u(), a.charCodeAt(t) === 123 ? (s = Te, t++) : (s = r, f === 0 && o(_r)), s !== r ? (u(), n = Js(), n !== r ? (u(), a.charCodeAt(t) === 125 ? (i = Be, t++) : (i = r, f === 0 && o(dr)), i !== r ? (l = Ts(), l === r && (l = null), u(), v = e, e = Hr(n, l)) : (t = e, e = r)) : (t = e, e = r)) : (t = e, e = r), e;
  }
  function Ts() {
    var e, s, n;
    return e = t, a.charCodeAt(t) === 37 ? (s = ze, t++) : (s = r, f === 0 && o(wr)), s !== r ? (n = q(), n !== r ? (v = e, e = Jr(n)) : (t = e, e = r)) : (t = e, e = r), e;
  }
  function Bs() {
    var e, s, n, i;
    return e = t, u(), a.charCodeAt(t) === 60 ? (s = Me, t++) : (s = r, f === 0 && o(yr)), s !== r ? (u(), n = j(), n !== r ? (u(), a.charCodeAt(t) === 62 ? (i = We, t++) : (i = r, f === 0 && o(Ar)), i !== r ? (u(), v = e, e = Kr(n)) : (t = e, e = r)) : (t = e, e = r)) : (t = e, e = r), e;
  }
  function q() {
    var e;
    return e = Fe(), e === r && (e = qs(), e === r && (e = Ns(), e === r && (e = Bs()))), e;
  }
  function Se() {
    var e;
    return e = zs(), e === r && (e = Ws(), e === r && (e = Zs(), e === r && (e = Gs(), e === r && (e = Ms(), e === r && (e = Us(), e === r && (e = Xs())))))), e;
  }
  function zs() {
    var e, s, n;
    return e = t, a.charCodeAt(t) === 64 ? (s = Ze, t++) : (s = r, f === 0 && o(Cr)), s !== r ? (n = S(), n !== r ? (v = e, e = Qr(n)) : (t = e, e = r)) : (t = e, e = r), e;
  }
  function Ms() {
    var e, s, n;
    return e = t, a.charCodeAt(t) === 33 ? (s = Ge, t++) : (s = r, f === 0 && o(br)), s !== r ? (n = S(), n !== r ? (v = e, e = Vr(n)) : (t = e, e = r)) : (t = e, e = r), e;
  }
  function Ws() {
    var e, s, n, i, l, d, E;
    return e = t, a.charCodeAt(t) === 40 ? (s = Ue, t++) : (s = r, f === 0 && o(xr)), s !== r ? (u(), n = N(), n !== r ? (u(), i = R(), i !== r ? (u(), l = N(), l !== r ? (u(), R(), u(), d = N(), d === r && (d = null), u(), a.charCodeAt(t) === 41 ? (E = Xe, t++) : (E = r, f === 0 && o(Er)), E !== r ? (v = e, e = Yr(n, l, d)) : (t = e, e = r)) : (t = e, e = r)) : (t = e, e = r)) : (t = e, e = r)) : (t = e, e = r), e;
  }
  function Zs() {
    var e, s, n;
    return e = t, a.charCodeAt(t) === 47 ? (s = He, t++) : (s = r, f === 0 && o(Fr)), s !== r ? (n = q(), n !== r ? (v = e, e = es(n)) : (t = e, e = r)) : (t = e, e = r), e;
  }
  function Gs() {
    var e, s, n;
    return e = t, a.charCodeAt(t) === 42 ? (s = Je, t++) : (s = r, f === 0 && o(Sr)), s !== r ? (n = q(), n !== r ? (v = e, e = rs(n)) : (t = e, e = r)) : (t = e, e = r), e;
  }
  function Us() {
    var e, s, n;
    return e = t, a.charCodeAt(t) === 63 ? (s = Ke, t++) : (s = r, f === 0 && o(jr)), s !== r ? (n = S(), n === r && (n = null), v = e, e = ss(n)) : (t = e, e = r), e;
  }
  function Xs() {
    var e, s, n;
    return e = t, a.charCodeAt(t) === 58 ? (s = Qe, t++) : (s = r, f === 0 && o(Pr)), s !== r ? (n = q(), n !== r ? (v = e, e = ts(n)) : (t = e, e = r)) : (t = e, e = r), e;
  }
  function N() {
    var e, s, n, i;
    if (e = t, s = q(), s !== r) {
      for (n = [], i = Se(); i !== r; )
        n.push(i), i = Se();
      v = e, e = ns(s, n);
    } else
      t = e, e = r;
    return e;
  }
  function j() {
    var e, s, n;
    if (e = t, s = [], n = N(), n !== r)
      for (; n !== r; )
        s.push(n), n = N();
    else
      s = r;
    return s !== r && (v = e, s = as(s)), e = s, e;
  }
  function je() {
    var e, s, n, i, l;
    if (e = t, s = [], n = t, i = R(), i !== r ? (l = j(), l !== r ? n = l : (t = n, n = r)) : (t = n, n = r), n !== r)
      for (; n !== r; )
        s.push(n), n = t, i = R(), i !== r ? (l = j(), l !== r ? n = l : (t = n, n = r)) : (t = n, n = r);
    else
      s = r;
    return s !== r && (v = e, s = is(s)), e = s, e;
  }
  function Hs() {
    var e, s, n, i, l;
    if (e = t, s = [], n = t, i = Ee(), i !== r ? (l = j(), l !== r ? n = l : (t = n, n = r)) : (t = n, n = r), n !== r)
      for (; n !== r; )
        s.push(n), n = t, i = Ee(), i !== r ? (l = j(), l !== r ? n = l : (t = n, n = r)) : (t = n, n = r);
    else
      s = r;
    return s !== r && (v = e, s = fs(s)), e = s, e;
  }
  function Pe() {
    var e, s, n;
    return e = t, s = j(), s !== r ? (n = je(), n === r && (n = Hs()), n === r && (n = null), v = e, e = os(s, n)) : (t = e, e = r), e;
  }
  function Js() {
    var e, s, n;
    return e = t, s = j(), s !== r ? (n = je(), n === r && (n = null), v = e, e = cs(s, n)) : (t = e, e = r), e;
  }
  function Ks() {
    var e, s, n, i;
    return e = t, u(), s = L(), s !== r ? (u(), n = Pe(), n !== r ? (u(), i = L(), i !== r ? (v = e, e = ls(n)) : (t = e, e = r)) : (t = e, e = r)) : (t = e, e = r), e;
  }
  function Qs() {
    var e;
    return e = at(), e === r && (e = rt(), e === r && (e = nt(), e === r && (e = Ys(), e === r && (e = et(), e === r && (e = Vs(), e === r && (e = tt(), e === r && (e = st()))))))), e;
  }
  function Vs() {
    var e, s, n;
    return e = t, a.substr(t, 6) === Y ? (s = Y, t += 6) : (s = r, f === 0 && o(kr)), s !== r ? (u(), n = D(), n !== r ? (v = e, e = us(n)) : (t = e, e = r)) : (t = e, e = r), e;
  }
  function Ys() {
    var e, s, n, i, l;
    return e = t, a.substr(t, 6) === ee ? (s = ee, t += 6) : (s = r, f === 0 && o(Rr)), s !== r ? (u(), n = L(), n !== r ? (i = Fe(), i !== r ? (l = L(), l !== r ? (v = e, e = ps(i)) : (t = e, e = r)) : (t = e, e = r)) : (t = e, e = r)) : (t = e, e = r), e;
  }
  function et() {
    var e, s, n, i;
    return e = t, a.substr(t, 6) === re ? (s = re, t += 6) : (s = r, f === 0 && o(Lr)), s !== r ? (u(), n = M(), n !== r ? (u(), i = M(), i !== r ? (u(), M(), v = e, e = gs(n, i)) : (t = e, e = r)) : (t = e, e = r)) : (t = e, e = r), e;
  }
  function rt() {
    var e, s, n;
    return e = t, a.substr(t, 4) === se ? (s = se, t += 4) : (s = r, f === 0 && o(Dr)), s !== r ? (u(), n = S(), n !== r ? (v = e, e = vs(n)) : (t = e, e = r)) : (t = e, e = r), e;
  }
  function st() {
    var e, s, n;
    return e = t, a.substr(t, 4) === te ? (s = te, t += 4) : (s = r, f === 0 && o(Ir)), s !== r ? (u(), n = S(), n !== r ? (v = e, e = $s(n)) : (t = e, e = r)) : (t = e, e = r), e;
  }
  function tt() {
    var e, s, n;
    return e = t, a.substr(t, 4) === ne ? (s = ne, t += 4) : (s = r, f === 0 && o(Or)), s !== r ? (u(), n = S(), n !== r ? (v = e, e = hs(n)) : (t = e, e = r)) : (t = e, e = r), e;
  }
  function nt() {
    var e, s, n;
    return e = t, a.substr(t, 4) === ae ? (s = ae, t += 4) : (s = r, f === 0 && o(qr)), s !== r ? (u(), n = S(), n !== r ? (v = e, e = ms(n)) : (t = e, e = r)) : (t = e, e = r), e;
  }
  function at() {
    var e, s, n, i, l;
    if (e = t, a.substr(t, 5) === ie ? (s = ie, t += 5) : (s = r, f === 0 && o(Nr)), s !== r)
      if (u(), n = L(), n !== r) {
        if (i = [], l = W(), l !== r)
          for (; l !== r; )
            i.push(l), l = W();
        else
          i = r;
        i !== r ? (l = L(), l !== r ? (v = e, e = _s(i)) : (t = e, e = r)) : (t = e, e = r);
      } else
        t = e, e = r;
    else
      t = e, e = r;
    return e;
  }
  function H() {
    var e, s, n, i;
    if (e = t, a.substr(t, 2) === fe ? (s = fe, t += 2) : (s = r, f === 0 && o(Tr)), s !== r) {
      for (n = [], ge.test(a.charAt(t)) ? (i = a.charAt(t), t++) : (i = r, f === 0 && o(de)); i !== r; )
        n.push(i), ge.test(a.charAt(t)) ? (i = a.charAt(t), t++) : (i = r, f === 0 && o(de));
      s = [s, n], e = s;
    } else
      t = e, e = r;
    return e;
  }
  function it() {
    var e, s, n, i, l, d, E, I;
    if (e = t, a.substr(t, 3) === oe ? (s = oe, t += 3) : (s = r, f === 0 && o(Br)), s !== r)
      if (u(), a.charCodeAt(t) === 91 ? (n = Q, t++) : (n = r, f === 0 && o(me)), n !== r)
        if (u(), i = D(), i !== r) {
          for (l = [], d = t, E = R(), E !== r ? (I = D(), I !== r ? (v = d, d = we(i, I)) : (t = d, d = r)) : (t = d, d = r); d !== r; )
            l.push(d), d = t, E = R(), E !== r ? (I = D(), I !== r ? (v = d, d = we(i, I)) : (t = d, d = r)) : (t = d, d = r);
          d = u(), a.charCodeAt(t) === 93 ? (E = V, t++) : (E = r, f === 0 && o(_e)), E !== r ? (v = e, e = ds(i, l)) : (t = e, e = r);
        } else
          t = e, e = r;
      else
        t = e, e = r;
    else
      t = e, e = r;
    return e;
  }
  function ft() {
    var e;
    return e = it(), e === r && (e = Ks()), e;
  }
  function D() {
    var e, s, n, i, l;
    if (e = t, s = ft(), s !== r) {
      for (u(), n = [], i = H(); i !== r; )
        n.push(i), i = H();
      v = e, e = ws(s);
    } else
      t = e, e = r;
    return e === r && (e = t, s = Qs(), s !== r ? (u(), a.charCodeAt(t) === 36 ? (n = Ve, t++) : (n = r, f === 0 && o(zr)), n !== r ? (i = u(), l = D(), l !== r ? (v = e, e = ys(s, l)) : (t = e, e = r)) : (t = e, e = r)) : (t = e, e = r)), e;
  }
  function ot() {
    var e, s;
    return e = t, s = D(), s !== r && (v = e, s = As(s)), e = s, e === r && (e = H()), e;
  }
  function ct() {
    var e;
    return e = ot(), e;
  }
  function lt() {
    var e, s;
    return e = t, u(), s = ut(), s === r && (s = pt(), s === r && (s = gt())), s !== r ? (u(), v = e, e = Cs(s)) : (t = e, e = r), e;
  }
  function ut() {
    var e, s, n;
    return e = t, a.substr(t, 6) === ce ? (s = ce, t += 6) : (s = r, f === 0 && o(Mr)), s !== r ? (u(), n = S(), n !== r ? (v = e, e = bs(n)) : (t = e, e = r)) : (t = e, e = r), e;
  }
  function pt() {
    var e, s, n;
    return e = t, a.substr(t, 6) === le ? (s = le, t += 6) : (s = r, f === 0 && o(Wr)), s !== r ? (u(), n = S(), n !== r ? (v = e, e = xs(n)) : (t = e, e = r)) : (t = e, e = r), e;
  }
  function gt() {
    var e, s;
    return e = t, a.substr(t, 4) === ue ? (s = ue, t += 4) : (s = r, f === 0 && o(Zr)), s !== r && (v = e, s = Es()), e = s, e;
  }
  function vt() {
    var e;
    return e = ct(), e === r && (e = lt()), e;
  }
  var $t = function(e) {
    this.type_ = "atom", this.source_ = e, this.location_ = ye();
  }, Z = function(e, s, n) {
    this.type_ = "pattern", this.arguments_ = { alignment: s }, n !== void 0 && (this.arguments_.seed = n), this.source_ = e;
  }, ht = function(e, s, n) {
    this.type_ = e, this.arguments_ = s, this.source_ = n;
  }, mt = function(e, s) {
    this.type_ = "element", this.source_ = e, this.options_ = s, this.location_ = ye();
  }, J = function(e, s) {
    this.type_ = "command", this.name_ = e, this.options_ = s;
  }, ke = 0;
  if (z = _(), z !== r && t === a.length)
    return z;
  throw z !== r && t < a.length && o(Ss()), js(
    U,
    F < a.length ? a.charAt(F) : null,
    F < a.length ? X(F, F + 1) : X(F, F)
  );
}
const Re = 3e-4, wt = (a, c) => (r, h) => {
  const C = a.source_[h].options_?.ops;
  if (C)
    for (const w of C)
      switch (w.type_) {
        case "stretch": {
          const b = ["fast", "slow"], { type: p, amount: g } = w.arguments_;
          if (!b.includes(p))
            throw new Error(`mini: stretch: type must be one of ${b.join("|")} but got ${p}`);
          r = A.reify(r)[p](c(g));
          break;
        }
        case "bjorklund": {
          w.arguments_.rotation ? r = r.euclidRot(c(w.arguments_.pulse), c(w.arguments_.step), c(w.arguments_.rotation)) : r = r.euclid(c(w.arguments_.pulse), c(w.arguments_.step));
          break;
        }
        case "degradeBy": {
          r = A.reify(r)._degradeByWith(A.rand.early(Re * w.arguments_.seed), w.arguments_.amount ?? 0.5);
          break;
        }
        case "tail": {
          const b = c(w.arguments_.element);
          r = r.fmap((p) => (g) => Array.isArray(p) ? [...p, g] : [p, g]).appLeft(b);
          break;
        }
        default:
          console.warn(`operator "${w.type_}" not implemented`);
      }
  return r;
};
function yt(a) {
  a.source_ = A.flatten(
    a.source_.map((c) => {
      const { reps: r } = c.options_ || {};
      return r ? (delete c.options_.reps, Array(r).fill(c)) : [c];
    })
  );
}
function T(a, c, r, h = 0) {
  r?.(a);
  const m = (_) => T(_, c, r, h);
  switch (a.type_) {
    case "pattern": {
      yt(a);
      const _ = a.source_.map((p) => m(p)).map(wt(a, m)), C = a.arguments_.alignment;
      if (C === "stack")
        return A.stack(..._);
      if (C === "polymeter") {
        const p = a.arguments_.stepsPerCycle ? m(a.arguments_.stepsPerCycle).fmap((y) => A.Fraction(y)) : A.pure(A.Fraction(_.length > 0 ? _[0].__weight : 1)), g = _.map((y) => y.fast(p.fmap((x) => x.div(y.__weight || 1))));
        return A.stack(...g);
      }
      if (C === "rand")
        return A.chooseInWith(A.rand.early(Re * a.arguments_.seed).segment(1), _);
      const w = a.source_.some((p) => !!p.options_?.weight);
      if (!w && C === "slowcat")
        return A.slowcat(..._);
      if (w) {
        const p = a.source_.reduce((y, x) => y + (x.options_?.weight || 1), 0), g = A.timeCat(...a.source_.map((y, x) => [y.options_?.weight || 1, _[x]]));
        return C === "slowcat" ? g._slow(p) : (g.__weight = p, g);
      }
      const b = A.sequence(..._);
      return b.__weight = _.length, b;
    }
    case "element":
      return m(a.source_);
    case "atom": {
      if (a.source_ === "~")
        return A.silence;
      if (!a.location_)
        return console.warn("no location for", a), a.source_;
      const _ = isNaN(Number(a.source_)) ? a.source_ : Number(a.source_);
      if (h === -1)
        return A.pure(_);
      const [C, w] = Le(c, a, h);
      return A.pure(_).withLoc(C, w);
    }
    case "stretch":
      return m(a.source_).slow(m(a.arguments_.amount));
    default:
      return console.warn(`node type "${a.type_}" not implemented -> returning silence`), A.silence;
  }
}
const Le = (a, c, r = 0) => {
  const { start: h, end: m } = c.location_, _ = a?.split("").slice(h.offset, m.offset).join(""), [C = 0, w = 0] = _ ? _.split(c.source_).map((b) => b.split("").filter((p) => p === " ").length) : [];
  return [h.offset + C + r, m.offset - w + r];
}, G = (a) => dt(a), At = (a) => {
  const c = G(a);
  let r = [];
  return T(
    c,
    a,
    (h) => {
      h.type_ === "atom" && r.push(h);
    },
    -1
  ), r;
}, Ct = (a, c = 0) => At(a).map((r) => Le(a, r, c)), De = (...a) => {
  const c = a.map((r) => {
    const h = `"${r}"`, m = G(h);
    return T(m, h);
  });
  return A.sequence(...c);
}, bt = (a, c) => {
  const r = `"${a}"`, h = G(r);
  return T(h, r, null, c);
}, xt = (a) => {
  const c = G(a);
  return T(c, a);
};
function Et(a) {
  return typeof a == "string" ? De(a) : A.reify(a);
}
function Ft() {
  A.setStringParser(De);
}
export {
  O as SyntaxError,
  Le as getLeafLocation,
  Ct as getLeafLocations,
  At as getLeaves,
  xt as h,
  bt as m,
  De as mini,
  G as mini2ast,
  Ft as miniAllStrings,
  Et as minify,
  dt as parse,
  T as patternifyAST
};
