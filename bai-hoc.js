/* bai-hoc.js — bổ sung bám sách Tin học 12, Chuyên đề 2 (Bài 6–10) cho index.html.
   Cần dòng window.APP=... trong index.html (xem hướng dẫn). */
const A = window.APP;
if (!A) console.warn('bai-hoc.js: thiếu window.APP trong index.html');
else {
const S = A.S, $ = s => document.querySelector(s), sh = a => [...a].sort(() => Math.random() - .5), rn = a => a[Math.random() * a.length | 0];
const esc = s => String(s).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
let tab = 'fig', open = false, alg = null, algSt = null, seqT = 0, Q = null, sc = [0, 0], sig = '';
const TEN = { pre: 'duyệt trước', in: 'duyệt giữa', post: 'duyệt sau', rev: 'duyệt ngược' };

/* ---------- tiện ích cây ---------- */
const root = () => A.T().root;
const walk = () => { const m = {}, list = []; (function f(n, d, k, p) { if (!n) return; const e = { n, d, k, p }; m[n.id] = e; list.push(e); f(n.l, d + 1, 2 * k + 1, e); f(n.r, d + 1, 2 * k + 2, e); })(root(), 0, 0, null); return { m, list }; };
const val = id => walk().m[id].n.v, subIds = n => n ? [n.id, ...subIds(n.l), ...subIds(n.r)] : [];
const hgt = n => n ? 1 + Math.max(hgt(n.l), hgt(n.r)) : 0;
const isBST = (n, lo = -1 / 0, hi = 1 / 0) => !n || (n.v > lo && n.v < hi && isBST(n.l, lo, n.v) && isBST(n.r, n.v, hi));
const bal = n => !n || (Math.abs(hgt(n.l) - hgt(n.r)) < 2 && bal(n.l) && bal(n.r));
const full = n => !n || (!n.l == !n.r && full(n.l) && full(n.r)), degen = n => !n || (!(n.l && n.r) && degen(n.l) && degen(n.r));
function show(steps, key, a) { alg = a || null; A.play(steps, key || 'pre'); algSt = S.steps; }
const mark = (cur, out, note) => show([{ l: -1, cur, out, note }]);
const needBST = () => { if (S.sub !== 'bst') { const d = A.DS[S.lesson]; d.sub = 'bst'; S.sub = 'bst'; S.sel = null; A.clear(); A.ui(); A.toast('Đã chuyển sang cây tìm kiếm nhị phân (BST)'); } };

/* ---------- thuật toán theo sách (dạng mảng: left(k)=2k+1, right(k)=2k+2) ---------- */
function revSteps() {
  const r = root(), s = [], out = []; if (!r) return s; const P = (l, c, note) => s.push({ l, cur: c, out: [...out], note });
  (function f(n) {
    P(1, n.id, 'vào reverseorder(' + n.v + ')'); P(2, n.id, 'sang con phải'); n.r ? f(n.r) : P(1, n.id, 'rỗng → quay lại');
    out.push(n.id); P(3, n.id, 'thăm ' + n.v); P(4, n.id, 'sang con trái'); n.l ? f(n.l) : P(1, n.id, 'rỗng → quay lại');
  })(r); return s;
}
function searchSteps(v) {
  const s = [], out = []; let n = root(), k = 0; const P = (l, x, note) => s.push({ l, cur: x ? x.id : null, out: [...out], note });
  for (;;) {
    if (!n) { P(1, null, 'k = ' + k + ' là nút giả None'); P(2, null, 'return −1: không tìm thấy khoá ' + v); return s; }
    out.push(n.id); P(1, n, 'k = ' + k + ': T[k] = ' + n.v + ' (khác None)');
    if (v === n.v) { P(4, n, v + ' = T[k]'); P(5, n, 'Tìm thấy → return k = ' + k); return s; }
    const L = v < n.v, nk = L ? 2 * k + 1 : 2 * k + 2;
    P(L ? 6 : 8, n, v + (L ? ' < ' : ' > ') + n.v + ' → tìm tiếp ở cây con ' + (L ? 'trái' : 'phải')); P(L ? 7 : 9, n, 'k = ' + (L ? '2k+1' : '2k+2') + ' = ' + nk);
    k = nk; n = L ? n.l : n.r;
  }
}
const seqOf = k => { const s = k == 'rev' ? revSteps() : A.tSteps(k); return s.length ? s[s.length - 1].out : []; };
const pathArr = v => { const s = searchSteps(v), l = s[s.length - 1], a = l.out.map(val); if (l.cur === null) a.push('None'); return a; };

/* ---------- mã Python theo sách (dạng mảng) ---------- */
const bk3 = (f, a, b, c) => [`def ${f}(A,k):`, '    if k < len(A) and A[k] != None:', a, b, c];
const PR = '        print(A[k], end=" ")', LF = f => `        ${f}(A,left(k))`, RT = f => `        ${f}(A,right(k))`;
const BK = {
  pre: bk3('preorder', PR, LF('preorder'), RT('preorder')), in: bk3('inorder', LF('inorder'), PR, RT('inorder')),
  post: bk3('postorder', LF('postorder'), RT('postorder'), PR), rev: bk3('reverseorder', RT('reverseorder'), PR, LF('reverseorder')),
  search: ['def search(T,k,v):', '    if k >= len(T) or T[k] == None:', '        return -1', '    else:', '        if v == T[k]:', '            return k', '        elif v < T[k]:', '            return search(T,left(k),v)', '        else:', '            return search(T,right(k),v)'],
  insert: ['def Tree_Insert(T,v):', '    k = 0', '    while k < len(T) and T[k] != None:', '        if v < T[k]:', '            k = left(k)', '        elif v > T[k]:', '            k = right(k)', '        else:', '            return', '    if k >= len(T):', '        T.extend([None]*(k - len(T) + 1))', '    T[k] = v']
};
const IM = { 1: 2, 2: 11, 3: 3, 4: 4, 5: 5, 6: 6, 7: 8 };   // dòng của index.html → dòng Tree_Insert trong sách

/* ---------- hình trong sách ---------- */
const PRE = [
  { t: 'H.6.4 · hoàn hảo (h=2)', s: '1(2(4,5),3(6,7))' }, { t: 'H.6.5 · hoàn chỉnh (10 nút)', s: '1(2(4(8,9),5(10,)),3(6,7))' },
  { t: 'H.6.6 · đánh chỉ số (12 nút)', s: '5(18(4(6,20),11(12,3)),7(9(1,),15))' }, { t: 'H.6.8a · cây tổng quát', s: '5(8(,3),4(7,))' },
  { t: 'H.6.10 · A=[4,1,7,0,2,6,8]', s: '4(1(0,2),7(6,8))' },
  { t: 'H.7.6a · BST [5,3,10,1,4,8,11,9]', a: [5, 3, 10, 1, 4, 8, 11, 9] }, { t: 'H.7.4a · BST cân bằng', a: [4, 2, 12, 1, 3, 7, 15, 6, 9] },
  { t: 'H.7.4b · BST suy biến', a: [10, 12, 15, 20] }, { t: 'H.7.7 · tìm kiếm khoá', a: [11, 4, 20, 1, 7, 15, 21, 6, 16] },
  { t: 'H.9.1 · BST 11 nút', a: [9, 3, 15, 1, 7, 12, 19, 4, 8, 10, 14] }
];
function load(p) {
  clearTimeout(seqT); const d = A.DS[S.lesson];
  if (p.a) { d.bst.root = null; p.a.forEach(x => A.bstIns(d.bst, x)); d.sub = 'bst'; } else { d.bin.root = A.parseTree(p.s); d.sub = 'bin'; }
  S.sub = d.sub; S.sel = null; alg = null; A.clear(); S.code = 'pre'; A.ui(); A.refresh(); A.toast('📖 ' + p.t);
}
function seqInsert(arr) {
  clearTimeout(seqT); const d = A.DS[S.lesson]; d.bst.root = null; d.sub = 'bst'; S.sub = 'bst'; S.sel = null; A.ui(); let i = 0;
  (function nx() {
    if (i >= arr.length) return A.toast('✅ Đã chèn xong ' + arr.length + ' khoá');
    const st = A.bstIns(d.bst, arr[i++]); show(st, 'insert'); seqT = setTimeout(nx, Math.max(st.length, 1) * 1000 + 700);
  })();
}

/* ---------- câu hỏi theo sách ---------- */
function mc(t, r, w, why, nodes, run) {
  w = [...new Set(w.map(String))].filter(x => x !== String(r)); if (w.length < 2) return null;
  const o = sh([String(r), ...sh(w).slice(0, 3)]);
  return { t, o, a: o.indexOf(String(r)), why, run: run || (nodes ? () => mark(nodes[0], nodes, why) : null) };
}
const QG = [
  () => { const { list } = walk(), h = Math.max(...list.map(e => e.d)); return mc('Chiều cao của cây (mức cao nhất của các nút) là bao nhiêu?', h, [h + 1, h + 2, h - 1, h + 3, list.length], 'Mức của gốc là 0, mức nút con = mức nút cha + 1. Nút sâu nhất ở mức ' + h + '.', list.filter(e => e.d == h).map(e => e.n.id)); },
  () => { const { list } = walk(), e = rn(list); return mc('Nút ' + e.n.v + ' ở mức mấy?', e.d, [e.d + 1, e.d + 2, e.d - 1, e.d + 3], 'Số cạnh từ gốc xuống nút ' + e.n.v + ' là ' + e.d + '.', [e.n.id]); },
  () => { const { list } = walk(), e = rn(list), g = (e.n.l ? 1 : 0) + (e.n.r ? 1 : 0); return mc('Bậc của nút ' + e.n.v + ' là bao nhiêu?', g, [0, 1, 2, 3], 'Bậc của nút là số nút con của nó.', [e.n.id]); },
  () => { const { list } = walk(), e = rn(list), k = e.k; return mc('Khi biểu diễn bằng mảng, nút ' + e.n.v + ' nằm ở chỉ số k nào?', k, [k + 1, k + 2, 2 * k + 1, k + 3, k - 1], 'Gốc có k = 0; con trái 2k+1, con phải 2k+2. Nút ' + e.n.v + ' có k = ' + k + '.', [e.n.id]); },
  () => { const k = rn([0, 1, 2, 3, 4, 5]), s = rn(['trái', 'phải']), r = s == 'trái' ? 2 * k + 1 : 2 * k + 2; return mc('Nút có chỉ số k = ' + k + ' thì nút con ' + s + ' có chỉ số bao nhiêu?', r, [2 * k + 1, 2 * k + 2, 2 * k, k + 1, 2 * k + 3], 'left(k) = 2k+1 và right(k) = 2k+2.'); },
  () => { const k = rn(['pre', 'in', 'post', 'rev']), f = x => seqOf(x).map(val).join(' '); return mc('Kết quả ' + TEN[k] + ' của cây đang hiển thị là:', f(k), [...['pre', 'in', 'post', 'rev'].filter(x => x != k).map(f), sh(seqOf(k)).map(val).join(' ')], 'Thứ tự đúng: ' + f(k) + '.', null, () => k == 'rev' ? show(revSteps(), 'pre', 'rev') : show(A.tSteps(k), k)); },
  () => { if (S.sub != 'bst') return null; const vs = walk().list.map(e => e.n.v), v = rn(vs.concat([Math.max(...vs) + 1, Math.min(...vs) - 1])), J = a => a.join(' → '); return mc('Tìm khoá ' + v + ' trên cây: trình tự các nút đi qua là?', J(pathArr(v)), [J(pathArr(rn(vs))), J(pathArr(rn(vs))), J([...pathArr(v)].reverse()), J(pathArr(v).slice(0, -1))], 'Mỗi nút so sánh v với T[k]: nhỏ hơn thì sang trái, lớn hơn thì sang phải, gặp None thì dừng.', null, () => show(searchSteps(v), 'pre', 'search')); },
  () => { const { list } = walk(), n = list.length, h = Math.max(...list.map(e => e.d)), mx = Math.max(...list.map(e => e.k)), c = n == 2 ** (h + 1) - 1 ? 'Hoàn hảo' : mx == n - 1 ? 'Hoàn chỉnh (nhưng không hoàn hảo)' : 'Không hoàn hảo và không hoàn chỉnh'; return mc('Cây đang hiển thị thuộc loại nào?', c, ['Hoàn hảo', 'Hoàn chỉnh (nhưng không hoàn hảo)', 'Không hoàn hảo và không hoàn chỉnh'], 'Hoàn hảo: n = 2^(h+1) − 1. Hoàn chỉnh: chỉ số mảng liên tục 0…n−1, không có None. Ở đây n = ' + n + ', h = ' + h + '.'); }
];
function newQ() {
  if (walk().list.length < 3) { Q = { msg: 'Cây cần ≥ 3 nút — hãy nạp hình ở 📚 hoặc thêm nút ở ✏️ Sửa.' }; return; }
  for (let i = 0; i < 40; i++) { const q = rn(QG)(); if (q) { Q = q; return; } }
}
function renderQ() {
  if (!Q) newQ(); const q = Q;
  $('#bkQ').innerHTML = `<small>Điểm ${sc[0]}/${sc[1]}</small>` + (q.msg ? `<div class="q">${q.msg}</div>` : `<div class="q">${esc(q.t)}</div>` +
    q.o.map((o, i) => `<button class="opt ${q.done ? (i == q.a ? 'ok' : i == q.pick ? 'bad' : '') : ''}" data-bk="ans" data-i="${i}">${esc(o)}</button>`).join('') +
    (q.done ? `<div class="fm">${q.pick == q.a ? '✅ Chính xác!' : '❌ Chưa đúng.'} ${esc(q.why)}</div>` : '') + '<div class="row"><button class="on" data-bk="nq">Câu tiếp ▶</button></div>');
}

/* ---------- hiển thị ---------- */
function renderInfo() {
  const { m, list } = walk(); if (!list.length) return '<small>Cây rỗng — nạp hình ở 📚 hoặc thêm nút ở ✏️ Sửa</small>';
  const r = root(), n = list.length, h = Math.max(...list.map(e => e.d)), lf = list.filter(e => !e.n.l && !e.n.r).length, mx = Math.max(...list.map(e => e.k));
  const dg = Math.max(...list.map(e => (e.n.l ? 1 : 0) + (e.n.r ? 1 : 0)));
  const c = [n == 2 ** (h + 1) - 1 ? 'Cây hoàn hảo' : mx == n - 1 ? 'Cây hoàn chỉnh' : 'Không hoàn hảo, không hoàn chỉnh', full(r) ? 'Cây đầy đủ' : 'Không đầy đủ'];
  if (isBST(r)) { c.push('Là cây tìm kiếm nhị phân'); if (bal(r)) c.push('Cân bằng'); if (n > 1 && degen(r)) c.push('Suy biến'); } else c.push('Không phải BST');
  let t = `<div class="fm">${n} nút · ${lf} lá · ${n - lf} nút trong · bậc của cây = ${dg} · chiều cao h = ${h} (cây hoàn hảo cao ${h} có ${2 ** (h + 1) - 1} nút)</div><div class="chips">${c.map(x => `<span>${x}</span>`).join('')}</div>`;
  const e = m[S.sel];
  if (e) { const p = e.p, sb = p ? (p.n.l === e.n ? p.n.r : p.n.l) : null, g = (e.n.l ? 1 : 0) + (e.n.r ? 1 : 0);
    t += `<div class="fm"><b>Nút ${e.n.v}</b> – ${!p ? 'nút gốc' : g ? 'nút trong (nút nhánh)' : 'nút lá'} · mức ${e.d} · bậc ${g} · cha: ${p ? p.n.v : 'không có'} · anh em: ${sb ? sb.v : 'không có'} · con trái: ${e.n.l ? e.n.l.v : '—'} · con phải: ${e.n.r ? e.n.r.v : '—'} · cây con có ${hgt(e.n)} mức<div class="row"><button data-bk="sub">🔺 Tô cây con</button><button data-bk="sib">👫 Anh em</button><button data-bk="up">⬆ Đường lên gốc</button></div></div>`;
  } else t += '<small>👆 Chạm một nút trên cây để xem mức, bậc, cha, anh em, cây con…</small>';
  return t;
}
function renderArr() {
  const { m, list } = walk(); if (!list.length) return ''; const mx = Math.max(...list.map(e => e.k)), byK = {}; list.forEach(e => byK[e.k] = e);
  const s = S.steps[S.i], cur = s && s.cur, vis = (s && s.out) || [], L = Math.min(mx + 1, 32); let h = '<div class="arr">';
  for (let k = 0; k < L; k++) { const e = byK[k]; h += `<div class="c ${e ? (e.n.id === cur ? 'cur' : vis.includes(e.n.id) ? 'vis' : e.n.id === S.sel ? 'sel' : '') : 'none'}"><i>${k}</i>${e ? e.n.v : 'None'}</div>`; }
  h += '</div>' + (mx + 1 > 32 ? `<small>… mảng cần ${mx + 1} phần tử (đa số là None): cây càng lệch càng tốn bộ nhớ</small>` : '');
  const e = m[S.sel] || list[0], k = e.k;
  return h + `<div class="fm">Nút <b>${e.n.v}</b>: k = ${k} · left(k) = 2·${k}+1 = ${2 * k + 1} · right(k) = 2·${k}+2 = ${2 * k + 2}` + (k ? ` · parent(k) = (${k}−1)//2 = ${(k - 1) >> 1}` : ' · là gốc, không có cha') + '</div>';
}
function renderCode() {
  const key = alg && algSt === S.steps ? alg : S.code, L = BK[key]; if (!L) return ''; const st = S.steps[S.i]; let l = st ? st.l : -1; if (key == 'insert' && st) l = IM[l] ?? -1;
  return L.map((t, i) => `<div class="ln ${i === l ? 'on' : ''}">${esc(t)}</div>`).join('') + (st ? `<div class="note">▶ ${esc(st.note || '')}</div>` : '');
}
function renderDyn() {
  if (tab == 'kn') $('#bkInfo').innerHTML = renderInfo();
  if (tab == 'arr' || tab == 'bst') { $('#bkArr').innerHTML = renderArr(); $('#bkCode').innerHTML = renderCode(); }
}
function setTab(t) {
  tab = t; sig = ''; document.querySelectorAll('#bk [data-tab]').forEach(b => b.classList.toggle('on', b.dataset.tab == t));
  ['fig', 'kn', 'arr', 'bst', 'q'].forEach(x => $('#bk-' + x).style.display = x == t ? 'block' : 'none');
  $('#bkShared').style.display = t == 'arr' || t == 'bst' ? 'block' : 'none'; if (t == 'q') renderQ(); renderDyn();
}
function toggle(v) { open = v; $('#bk').style.display = v ? 'block' : 'none'; const c = $('#code'); if (c) c.classList.toggle('bkhide', v); sig = ''; if (v) renderDyn(); }

/* ---------- giao diện ---------- */
const st = document.createElement('style');
st.textContent = `#bkBtn{position:fixed;right:12px;top:52%;width:62px;height:62px;border-radius:50%;font-size:26px;padding:0;z-index:7;box-shadow:0 4px 14px #0007}
#bk{position:fixed;left:0;right:0;bottom:0;max-height:48vh;overflow:auto;z-index:12;background:#1b1230f2;padding:8px 10px;display:none;color:#fff}
body.scan #bkBtn,body.scan #bk{display:none!important}#code.bkhide{display:none!important}
.bkt{display:flex;gap:4px;flex-wrap:wrap;margin-bottom:6px}.bkt button{padding:5px 10px;font-size:13px}
.arr{display:flex;flex-wrap:wrap;gap:3px;margin:6px 0}.arr .c{min-width:38px;padding:2px 4px 4px;border-radius:8px;background:#fff;color:#2b2350;text-align:center;font-weight:700;font-size:14px}
.arr .c i{display:block;font-style:normal;font-size:10px;color:#ff6fb5}.arr .none{background:#3a2f5c;color:#9a8cc0}.arr .cur{background:#ff6a00;color:#fff}.arr .vis{background:#ffc72c}.arr .sel{outline:3px solid #7de3ff}
#bk .fm{font-size:13px;margin:6px 0}.chips span{display:inline-block;background:#ffffff1f;border-radius:999px;padding:2px 10px;margin:0 4px 4px 0;font-size:12px}
.bkc{font:12px/1.5 Consolas,monospace;background:#0006;border-radius:10px;padding:6px;margin-top:6px}.bkc .ln{white-space:pre;padding:0 6px;border-radius:5px;color:#cbb8ee}
.bkc .ln.on{background:#ff8fc7;color:#fff;font-weight:700}.bkc .note{color:#ffe98a;font:600 12px system-ui;margin-top:4px}
#bk input{background:#fff;color:#5b3a6b}#bk input.t{width:170px}#bk input.n{width:80px}`;
document.head.appendChild(st);
const btn = document.createElement('button'); btn.id = 'bkBtn'; btn.className = 'alt'; btn.textContent = '📖'; btn.title = 'Học theo sách'; document.body.appendChild(btn);
const pan = document.createElement('div'); pan.id = 'bk';
const B = (a, t, x = '', c = '') => `<button class="${c}" data-bk="${a}" ${x}>${t}</button>`;
pan.innerHTML = `<div class="bkt">${[['fig', '📚 Hình sách'], ['kn', '🧩 Khái niệm'], ['arr', '🔢 Mảng·Duyệt'], ['bst', '🔎 BST'], ['q', '❓ Hỏi']].map(([k, t]) => `<button data-tab="${k}">${t}</button>`).join('')}<button class="alt" data-bk="close">✖</button></div>
<div id="bk-fig"><div class="row">${PRE.map((p, i) => B('pre', p.t, `data-i="${i}"`)).join('')}</div>
  <div class="row"><input id="bkSeq" class="t" type="text" value="7,1,9,0,5,10,2">${B('seq', '▶ Chèn lần lượt vào BST', '', 'on')}</div><small>Bài 7: A = [7,1,9,0,5,10,2] → T = Tree(); for x in A: Tree_Insert(T,x)</small></div>
<div id="bk-kn"><div id="bkInfo"></div></div>
<div id="bk-arr"><div class="row">${B('alg', 'Duyệt trước', 'data-k="pre"')}${B('alg', 'Duyệt giữa', 'data-k="in"')}${B('alg', 'Duyệt sau', 'data-k="post"')}${B('alg', 'Duyệt ngược', 'data-k="rev"')}${B('pv', '◀')}${B('pp', '⏯')}${B('nx', '▶')}</div></div>
<div id="bk-bst"><div class="row"><input id="bkFind" class="n" type="number" placeholder="khoá v">${B('find', '🔎 Tìm', '', 'on')}<input id="bkIns" class="n" type="number" placeholder="khoá v">${B('ins', '＋ Chèn từng bước', '', 'on')}</div>
  <div class="row">${B('sort', '↕ BSTSort (duyệt giữa → tăng dần)')}${B('alg', 'Duyệt ngược (giảm dần)', 'data-k="rev"')}${B('chk', '✔ Có phải BST?')}${B('pv', '◀')}${B('pp', '⏯')}${B('nx', '▶')}</div></div>
<div id="bk-q"><div id="bkQ"></div></div>
<div id="bkShared"><div id="bkArr"></div><div id="bkCode" class="bkc"></div></div>`;
document.body.appendChild(pan);
[pan, btn].forEach(e => e.addEventListener('pointerdown', ev => ev.stopPropagation()));   // chạm bảng không chọn nhầm nút 3D
btn.onclick = () => toggle(!open);

pan.addEventListener('click', e => {
  const t = e.target.closest('[data-tab]'); if (t) return setTab(t.dataset.tab);
  const b = e.target.closest('[data-bk]'); if (!b) return; const a = b.dataset.bk, d = b.dataset, { m } = walk(), en = m[S.sel], num = id => { const v = $(id).value.trim(); return v === '' ? NaN : +v; };
  if (a == 'close') toggle(false);
  else if (a == 'pre') load(PRE[+d.i]);
  else if (a == 'seq') { const arr = $('#bkSeq').value.split(/[\s,;]+/).map(Number).filter(Number.isFinite); arr.length ? seqInsert(arr) : A.toast('Nhập dãy số, cách nhau bởi dấu phẩy'); }
  else if (a == 'alg') { clearTimeout(seqT); d.k == 'rev' ? show(revSteps(), 'pre', 'rev') : show(A.tSteps(d.k), d.k); }
  else if (a == 'sort') { needBST(); show(A.tSteps('in'), 'in'); A.toast('Duyệt giữa trên BST cho dãy tăng dần'); }
  else if (a == 'find') { const v = num('#bkFind'); if (isNaN(v)) return A.toast('Nhập khoá cần tìm'); needBST(); show(searchSteps(v), 'pre', 'search'); }
  else if (a == 'ins') { const v = num('#bkIns'); if (isNaN(v)) return A.toast('Nhập khoá cần chèn'); needBST(); show(A.bstIns(A.T(), v), 'insert'); }
  else if (a == 'chk') A.toast(isBST(root()) ? '✅ Đây là cây tìm kiếm nhị phân' : '❌ Không phải BST: có nút vi phạm quy tắc trái < nút < phải');
  else if (a == 'pv' || a == 'nx') { clearInterval(S.tm); S.tm = 0; S.i = Math.max(0, Math.min(S.steps.length - 1, S.i + (a == 'nx' ? 1 : -1))); A.refresh(); }
  else if (a == 'pp') { if (S.tm) { clearInterval(S.tm); S.tm = 0; } else if (S.steps.length) { const s = S.steps, c = S.code, g = alg; if (S.i >= s.length - 1) S.i = 0; A.play(s, c); algSt = S.steps; alg = g; } }
  else if (a == 'sub' && en) mark(en.n.id, subIds(en.n), 'Cây con gốc ' + en.n.v + ' gồm: ' + subIds(en.n).map(val).join(', '));
  else if (a == 'sib' && en) { const p = en.p, sb = p ? (p.n.l === en.n ? p.n.r : p.n.l) : null; sb ? mark(en.n.id, [sb.id], 'Nút ' + en.n.v + ' và nút ' + sb.v + ' là anh em (cùng cha ' + p.n.v + ')') : A.toast('Nút này không có anh em'); }
  else if (a == 'up' && en) { const ids = []; for (let x = en; x; x = x.p) ids.push(x.n.id); mark(en.n.id, ids, 'Đường lên gốc: ' + ids.map(val).join(' → ') + ' (mức ' + en.d + ' → 0)'); }
  else if (a == 'ans') { if (!Q || Q.done) return; Q.done = 1; Q.pick = +d.i; sc[1]++; if (Q.pick == Q.a) sc[0]++; renderQ(); Q.run && Q.run(); }
  else if (a == 'nq') { Q = null; renderQ(); }
});
setInterval(() => {
  if (!open) return; const { list } = walk();
  const s = [S.lesson, S.sub, S.sel, S.i, S.steps.length, tab, alg, list.map(e => e.n.id + ':' + e.n.v + ':' + e.k).join()].join('|');
  if (s !== sig) { sig = s; renderDyn(); }
}, 250);
setTab('fig');
}
