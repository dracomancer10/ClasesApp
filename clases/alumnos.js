// Estructura base para gestión de alumnos independientes

// Estado global de alumnos
let alumnos = [];
let asistenciaAlumnos = {}; // { alumnoId: { 'YYYY-MM-DD': true/false } }
let pagosAlumnos = {}; // { alumnoId: [{fecha, monto, tipo, observacion}] }
let editingAlumnoIdx = null;

// Cargar desde localStorage
function loadAlumnosFromLocal() {
  const a = localStorage.getItem('alumnos_particulares');
  const as = localStorage.getItem('asistencia_alumnos');
  const p = localStorage.getItem('pagos_alumnos');
  if (a) alumnos = JSON.parse(a);
  if (as) asistenciaAlumnos = JSON.parse(as);
  if (p) pagosAlumnos = JSON.parse(p);
}
function saveAlumnosToLocal() {
  localStorage.setItem('alumnos_particulares', JSON.stringify(alumnos));
  localStorage.setItem('asistencia_alumnos', JSON.stringify(asistenciaAlumnos));
  localStorage.setItem('pagos_alumnos', JSON.stringify(pagosAlumnos));
}

// Colores sobrios por día de la semana
const dayColors = [
  'bg-gray-200', // Domingo
  'bg-blue-100', // Lunes
  'bg-green-100', // Martes
  'bg-yellow-100', // Miércoles
  'bg-pink-100', // Jueves
  'bg-purple-100', // Viernes
  'bg-cyan-100' // Sábado
];

// Renderizar la página de alumnos
function renderAlumnosPage() {
  const cont = document.getElementById('alumnosPage');
  // Selector de mes
  const now = new Date();
  let selectedMonth = now.getMonth();
  let selectedYear = now.getFullYear();
  cont.innerHTML = `
    <div class="flex items-center gap-4 mb-4">
      <label class="font-semibold">Mes:</label>
      <select id="alumnosMesSelect" class="border rounded px-2 py-1">
        ${Array.from({length: 12}, (_, i) => `<option value="${i}" ${i===selectedMonth?'selected':''}>${["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"][i]}</option>`).join('')}
      </select>
      <span class="text-gray-500 text-sm">Año: ${selectedYear}</span>
      <button id="addAlumnoBtn" class="ml-auto bg-blue-700 text-white px-4 py-1 rounded hover:bg-blue-800 transition">Agregar alumno</button>
    </div>
    <div id="alumnosTablaCont"></div>
    <div id="alumnoModalBg" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 hidden">
      <div class="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
        <button id="closeAlumnoModalBtn" class="absolute top-2 right-3 text-2xl text-gray-400 hover:text-gray-700">&times;</button>
        <h2 class="text-lg font-bold mb-4">Registrar alumno</h2>
        <form id="alumnoForm" class="flex flex-col gap-3">
          <div>
            <label class="block font-semibold mb-1">Nombre</label>
            <input type="text" id="alumnoNombre" required class="w-full border rounded px-2 py-1" />
          </div>
          <div>
            <label class="block font-semibold mb-1">Días de clase</label>
            <select id="alumnoDias" multiple required class="w-full border rounded px-2 py-1">
              <option value="1">Lunes</option>
              <option value="2">Martes</option>
              <option value="3">Miércoles</option>
              <option value="4">Jueves</option>
              <option value="5">Viernes</option>
              <option value="6">Sábado</option>
              <option value="0">Domingo</option>
            </select>
            <span class="text-gray-500 text-xs">(Ctrl+Click para seleccionar varios)</span>
          </div>
          <div>
            <label class="block font-semibold mb-1">Tipo de pago</label>
            <select id="alumnoTipoPago" required class="w-full border rounded px-2 py-1">
              <option value="clase">Por clase</option>
              <option value="mes">Mensual</option>
            </select>
          </div>
          <div>
            <label class="block font-semibold mb-1">Valor</label>
            <input type="number" id="alumnoValor" min="0" required class="w-full border rounded px-2 py-1" />
          </div>
          <div class="flex justify-end">
            <button type="submit" class="bg-blue-700 text-white px-4 py-1 rounded hover:bg-blue-800 transition">Guardar</button>
          </div>
        </form>
      </div>
    </div>
    <div id="pagoModalBg" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 hidden"></div>
  `;
  renderAlumnosTabla(selectedMonth, selectedYear);
  document.getElementById('alumnosMesSelect').onchange = function() {
    renderAlumnosTabla(parseInt(this.value), selectedYear);
  };
  document.getElementById('addAlumnoBtn').onclick = openAlumnoModal;
  document.getElementById('closeAlumnoModalBtn').onclick = closeAlumnoModal;
  document.getElementById('alumnoModalBg').onclick = (e) => { if (e.target === document.getElementById('alumnoModalBg')) closeAlumnoModal(); };
}

function renderAlumnosTabla(month, year) {
  const cont = document.getElementById('alumnosTablaCont');
  if (alumnos.length === 0) {
    cont.innerHTML = '<span class="text-gray-500">No hay alumnos registrados.</span>';
    return;
  }
  // Generar fechas del mes
  let fechas = [];
  let date = new Date(year, month, 1);
  while (date.getMonth() === month) {
    fechas.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  // Filtrar solo los días en los que al menos un alumno tiene clase
  let fechasFiltradas = fechas.filter(f => alumnos.some(al => al.dias.map(Number).includes(f.getDay())));
  
  // Obtener el día actual para resaltar
  const today = new Date();
  const isCurrentMonth = today.getMonth() === month && today.getFullYear() === year;
  
  // Tabla
  let html = '<table id="tablaAsistencia" class="min-w-full text-sm text-left border border-gray-300 bg-white"><thead><tr class="bg-white font-bold shadow">';
  html += '<th class="border border-gray-300 bg-white"></th>';
  fechasFiltradas.forEach(f => {
    const isToday = isCurrentMonth && f.getDate() === today.getDate();
    const todayClass = isToday ? 'border-l-2 border-r-2 border-blue-400' : '';
    html += `<th class="${dayColors[f.getDay()]} border border-gray-300 text-center bg-white ${todayClass}">${["D","L","M","M","J","V","S"][f.getDay()]}<br>${String(f.getDate()).padStart(2,'0')}/${String(month+1).padStart(2,'0')}</th>`;
  });
  html += '</tr></thead><tbody>';
  
  // Calcular estadísticas de asistencia por alumno
  let estadisticasAlumnos = [];
  
  alumnos.forEach((al, idx) => {
    html += `<tr class="border-b border-gray-300 hover:bg-blue-50 cursor-pointer bg-white"><td class="font-bold text-blue-900 border border-gray-300 alumno-nombre bg-white" data-idx="${idx}" style="cursor:pointer;">${al.nombre}</td>`;
    
    // Contadores para este alumno
    let totalClases = 0;
    let asistencias = 0;
    let ausencias = 0;
    
    fechasFiltradas.forEach(f => {
      const isToday = isCurrentMonth && f.getDate() === today.getDate();
      const todayClass = isToday ? 'border-l-2 border-r-2 border-blue-400' : '';
      
      if (al.dias.map(Number).includes(f.getDay())) {
        totalClases++;
        const fechaStr = `${year}-${String(month+1).padStart(2,'0')}-${String(f.getDate()).padStart(2,'0')}`;
        if (!asistenciaAlumnos[al.id]) asistenciaAlumnos[al.id] = {};
        let estado = asistenciaAlumnos[al.id][fechaStr];
        // Triple estado: undefined/null/'' = vacío, 'ok'/true = asistió, 'x' = no asistió
        let cellClass = `text-center border border-gray-300 asistencia-celda bg-white ${todayClass}`;
        let boxClass = 'inline-flex w-6 h-6 rounded border transition duration-100 cursor-pointer select-none items-center justify-center mx-auto bg-white';
        let iconHtml = '';
        if (estado === 'ok' || estado === true) {
          boxClass += ' border-green-500';
          iconHtml = '<svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>';
          asistencias++;
        } else if (estado === 'x') {
          boxClass += ' border-red-400';
          iconHtml = '<svg class="w-4 h-4 text-red-500" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 6l12 12M6 18L18 6"/></svg>';
          ausencias++;
        } else {
          boxClass += ' border-gray-300';
          iconHtml = '';
        }
        html += `<td class="${cellClass}" data-alid="${al.id}" data-fecha="${fechaStr}"><div class="${boxClass}">${iconHtml}</div></td>`;
      } else {
        html += `<td class="border border-gray-300 bg-white ${todayClass}"></td>`;
      }
    });
    html += '</tr>';
    
    // Guardar estadísticas del alumno
    estadisticasAlumnos.push({
      nombre: al.nombre,
      totalClases,
      asistencias,
      ausencias,
      porcentaje: totalClases > 0 ? Math.round((asistencias / totalClases) * 100) : 0
    });
    
    // Fila de pagos expandible
    html += `<tr id="pagosFila${idx}" class="hidden"><td colspan="${fechasFiltradas.length+1}" class="border-t-2 border-blue-200 bg-white">`;
    html += renderPagosAlumno(al.id, month, year, idx);
    html += '</td></tr>';
  });
  html += '</tbody></table>';
  
  // Agregar sección de estadísticas de asistencia
  html += '<div class="mt-6">';
  html += '<h3 class="text-lg font-bold text-gray-800 mb-3">📊 Estadísticas de Asistencia Mensual</h3>';
  html += '<table class="min-w-full text-sm text-left border border-gray-300 bg-white">';
  html += '<thead><tr class="bg-white font-bold shadow">';
  html += '<th class="border border-gray-300 bg-white text-center">Alumno</th>';
  html += '<th class="border border-gray-300 bg-white text-center">Clases Programadas</th>';
  html += '<th class="border border-gray-300 bg-white text-center">Asistencias</th>';
  html += '<th class="border border-gray-300 bg-white text-center">Ausencias</th>';
  html += '<th class="border border-gray-300 bg-white text-center">Porcentaje</th>';
  html += '<th class="border border-gray-300 bg-white text-center">Barra de Progreso</th>';
  html += '</tr></thead><tbody>';
  
  estadisticasAlumnos.forEach(estad => {
    const colorClass = estad.porcentaje >= 80 ? 'text-green-700' : 
                      estad.porcentaje >= 60 ? 'text-yellow-700' : 
                      'text-red-700';
    const bgColorClass = estad.porcentaje >= 80 ? 'bg-green-50' : 
                        estad.porcentaje >= 60 ? 'bg-yellow-50' : 
                        'bg-red-50';
    const barColor = estad.porcentaje >= 80 ? 'bg-green-500' : 
                    estad.porcentaje >= 60 ? 'bg-yellow-500' : 
                    'bg-red-500';
    
    html += `<tr class="border-b border-gray-300 hover:bg-blue-50 bg-white">`;
    html += `<td class="font-bold text-blue-900 border border-gray-300 bg-white px-3 py-2">${estad.nombre}</td>`;
    html += `<td class="border border-gray-300 bg-white text-center px-3 py-2">${estad.totalClases}</td>`;
    html += `<td class="border border-gray-300 bg-white text-center px-3 py-2 text-green-600 font-semibold">✓ ${estad.asistencias}</td>`;
    html += `<td class="border border-gray-300 bg-white text-center px-3 py-2 text-red-600 font-semibold">✗ ${estad.ausencias}</td>`;
    html += `<td class="border border-gray-300 ${bgColorClass} text-center px-3 py-2">`;
    html += `<span class="font-bold text-lg ${colorClass}">${estad.porcentaje}%</span>`;
    html += `</td>`;
    html += `<td class="border border-gray-300 bg-white text-center px-3 py-2">`;
    html += `<div class="w-24 h-3 bg-gray-200 rounded-full overflow-hidden mx-auto">`;
    html += `<div class="h-full ${barColor}" style="width: ${estad.porcentaje}%"></div>`;
    html += `</div>`;
    html += `</td>`;
    html += `</tr>`;
  });
  
  html += '</tbody></table>';
  html += '</div>';
  
  cont.innerHTML = html;
  
  // Asignar eventos: solo el nombre del alumno despliega/cierra pagos (toggle, solo una abierta)
  document.querySelectorAll('.alumno-nombre').forEach(td => {
    td.onclick = function(e) {
      const idx = this.getAttribute('data-idx');
      const fila = document.getElementById(`pagosFila${idx}`);
      // Si ya está abierta, ciérrala
      if (fila && !fila.classList.contains('hidden')) {
        fila.classList.add('hidden');
        return;
      }
      // Cerrar todas
      document.querySelectorAll('tr[id^="pagosFila"]').forEach(f => f.classList.add('hidden'));
      // Abrir la seleccionada
      if (fila) fila.classList.remove('hidden');
    };
  });
  // Triple estado en celdas de asistencia
  document.querySelectorAll('.asistencia-celda').forEach(td => {
    td.onclick = function(e) {
      e.stopPropagation();
      const alumnoId = this.getAttribute('data-alid');
      const fecha = this.getAttribute('data-fecha');
      if (!alumnoId || !fecha) return;
      let estado = asistenciaAlumnos[alumnoId][fecha];
      if (estado === 'ok' || estado === true) {
        asistenciaAlumnos[alumnoId][fecha] = 'x';
      } else if (estado === 'x') {
        asistenciaAlumnos[alumnoId][fecha] = '';
      } else {
        asistenciaAlumnos[alumnoId][fecha] = 'ok';
      }
      saveAlumnosToLocal();
      renderAlumnosTabla(month, year);
      if (!document.getElementById('reporteModal').classList.contains('hidden')) {
        renderReportePagos();
      }
    };
  });
  // Evento para editar alumno
  document.querySelectorAll('.edit-alumno-btn').forEach(btn => {
    btn.onclick = function(e) {
      e.stopPropagation();
      editingAlumnoIdx = parseInt(this.getAttribute('data-idx'));
      openAlumnoModal(alumnos[editingAlumnoIdx]);
    };
  });
}

function renderPagosAlumno(alumnoId, month, year, idx) {
  if (!pagosAlumnos[alumnoId]) pagosAlumnos[alumnoId] = [];
  let pagosMes = pagosAlumnos[alumnoId].filter(p => {
    const d = new Date(p.fecha);
    return d.getMonth() === month && d.getFullYear() === year;
  });
  let html = `<div class="mb-2 font-semibold flex items-center justify-between">Pagos del mes <button class='edit-alumno-btn text-xs text-gray-400 hover:text-gray-700 rounded px-2 py-0.5 border border-gray-200 ml-2' data-idx='${idx}' title='Editar'>✎ Editar alumno</button></div>`;
  html += '<table class="min-w-full text-xs text-left"><thead><tr><th>Fecha</th><th>Monto</th><th>Tipo de pago</th><th>Observación</th></tr></thead><tbody>';
  pagosMes.forEach(p => {
    html += `<tr><td>${p.fecha}</td><td>$${p.monto}</td><td>${p.tipo}</td><td>${p.observacion || ''}</td></tr>`;
  });
  html += '</tbody></table>';
  html += `<button class="mt-2 bg-blue-700 text-white px-3 py-1 rounded" onclick="openPagoModal('${alumnoId}',${month},${year});event.stopPropagation();">Registrar pago</button>`;
  return html;
}

function openAlumnoModal(al) {
  document.getElementById('alumnoModalBg').classList.remove('hidden');
  const form = document.getElementById('alumnoForm');
  // Eliminar botón previo si existe
  let btnEliminar = document.getElementById('eliminarAlumnoBtn');
  if (btnEliminar) btnEliminar.remove();
  if (al) {
    form.querySelector('#alumnoNombre').value = al.nombre;
    Array.from(form.querySelector('#alumnoDias').options).forEach(opt => {
      opt.selected = al.dias.includes(opt.value);
    });
    form.querySelector('#alumnoTipoPago').value = al.tipoPago;
    form.querySelector('#alumnoValor').value = al.valor;
    // Agregar botón eliminar
    const eliminarBtn = document.createElement('button');
    eliminarBtn.id = 'eliminarAlumnoBtn';
    eliminarBtn.type = 'button';
    eliminarBtn.className = 'mt-2 bg-red-600 text-white px-4 py-1 rounded hover:bg-red-800 transition';
    eliminarBtn.textContent = 'Eliminar alumno';
    eliminarBtn.onclick = function() {
      if (confirm('¿Seguro que deseas eliminar este alumno y todos sus datos?')) {
        // Eliminar de alumnos
        const idx = alumnos.findIndex(a => a.id === al.id);
        if (idx !== -1) alumnos.splice(idx, 1);
        // Eliminar asistencia y pagos
        delete asistenciaAlumnos[al.id];
        delete pagosAlumnos[al.id];
        saveAlumnosToLocal();
        closeAlumnoModal();
        renderAlumnosTabla(new Date().getMonth(), new Date().getFullYear());
        renderReportePagos && renderReportePagos();
      }
    };
    form.appendChild(eliminarBtn);
  } else {
    form.reset();
  }
  form.onsubmit = function(e) {
    e.preventDefault();
    const nombre = form.querySelector('#alumnoNombre').value.trim();
    const dias = Array.from(form.querySelector('#alumnoDias').selectedOptions).map(opt => opt.value);
    const tipoPago = form.querySelector('#alumnoTipoPago').value;
    const valor = parseInt(form.querySelector('#alumnoValor').value);
    if (!nombre || dias.length === 0 || !tipoPago || !valor) return;
    if (editingAlumnoIdx !== null && alumnos[editingAlumnoIdx]) {
      alumnos[editingAlumnoIdx] = { ...alumnos[editingAlumnoIdx], nombre, dias, tipoPago, valor };
      editingAlumnoIdx = null;
    } else {
      const id = 'al' + (alumnos.length + 1) + '_' + Date.now();
      alumnos.push({ id, nombre, dias, tipoPago, valor });
    }
    saveAlumnosToLocal();
    closeAlumnoModal();
    renderAlumnosTabla(new Date().getMonth(), new Date().getFullYear());
  };
}
function closeAlumnoModal() {
  document.getElementById('alumnoModalBg').classList.add('hidden');
  document.getElementById('alumnoForm').reset();
}

// Mostrar panel individual de alumno (asistencia y pagos)
function showAlumnoPanel(idx) {
  const al = alumnos[idx];
  const panel = document.getElementById('alumnoPanel');
  panel.innerHTML = `<h2 class="text-xl font-bold mb-2">${al.nombre}</h2>
    <div class="mb-4">Días de clase: ${al.dias.map(d=>["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"][parseInt(d)]).join(', ')}</div>
    <div class="mb-4">Tipo de pago: ${al.tipoPago === 'clase' ? 'Por clase' : 'Mensual'} - Valor: $${al.valor}</div>
    <div class="mb-4"><button class="bg-green-600 text-white px-3 py-1 rounded" onclick="renderAsistenciaAlumno('${al.id}')">Asistencia</button> <button class="bg-yellow-600 text-white px-3 py-1 rounded" onclick="renderPagosAlumno('${al.id}')">Pagos</button></div>
    <div id="alumnoDetalle"></div>`;
}

// Renderizar asistencia del alumno (solo días asignados)
function renderAsistenciaAlumno(alumnoId) {
  const al = alumnos.find(a => a.id === alumnoId);
  const cont = document.getElementById('alumnoDetalle');
  // Mostrar solo los días asignados del mes actual
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  let diasAsignados = al.dias.map(Number);
  let fechas = [];
  let date = new Date(year, month, 1);
  while (date.getMonth() === month) {
    if (diasAsignados.includes(date.getDay())) {
      fechas.push(new Date(date));
    }
    date.setDate(date.getDate() + 1);
  }
  let html = `<h3 class="font-bold mb-2">Asistencia (${["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"][month]})</h3>`;
  html += '<table class="min-w-full text-sm text-left"><thead><tr><th>Fecha</th><th>Asistió</th></tr></thead><tbody>';
  fechas.forEach(f => {
    const fechaStr = `${year}-${String(month+1).padStart(2,'0')}-${String(f.getDate()).padStart(2,'0')}`;
    if (!asistenciaAlumnos[alumnoId]) asistenciaAlumnos[alumnoId] = {};
    if (asistenciaAlumnos[alumnoId][fechaStr] === undefined) asistenciaAlumnos[alumnoId][fechaStr] = '';
    html += `<tr><td>${String(f.getDate()).padStart(2,'0')}/${String(month+1).padStart(2,'0')}/${year}</td><td><input type="checkbox" ${(asistenciaAlumnos[alumnoId][fechaStr] === 'ok') ? 'checked' : ''} onchange="toggleAsistenciaAlumno('${alumnoId}','${fechaStr}',this.checked)" /></td></tr>`;
  });
  html += '</tbody></table>';
  cont.innerHTML = html;
}
function toggleAsistenciaAlumno(alumnoId, fecha, checked) {
  if (!asistenciaAlumnos[alumnoId]) asistenciaAlumnos[alumnoId] = {};
  asistenciaAlumnos[alumnoId][fecha] = checked ? 'ok' : '';
  saveAlumnosToLocal();
}

// Modal para registrar pago
function openPagoModal(alumnoId, month, year) {
  const modalBg = document.getElementById('pagoModalBg');
  modalBg.innerHTML = `<div class="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
    <button onclick="closePagoModal()" class="absolute top-2 right-3 text-2xl text-gray-400 hover:text-gray-700">&times;</button>
    <h2 class="text-lg font-bold mb-4">Registrar pago</h2>
    <form id="pagoForm" class="flex flex-col gap-3">
      <div id="pagoClaseMsg" class="hidden text-blue-700 text-sm bg-blue-50 rounded px-2 py-1 mb-2">El ingreso por clase se calcula automáticamente según la asistencia marcada. No es necesario registrar pagos manuales por clase.</div>
      <div id="pagoFechaDiv">
        <label class="block font-semibold mb-1">Fecha</label>
        <input type="date" id="pagoFecha" required class="w-full border rounded px-2 py-1" value="${new Date().toISOString().slice(0,10)}" />
      </div>
      <div id="pagoMontoDiv">
        <label class="block font-semibold mb-1">Monto</label>
        <input type="number" id="pagoMonto" min="0" required class="w-full border rounded px-2 py-1" />
      </div>
      <div>
        <label class="block font-semibold mb-1">Tipo de pago</label>
        <select id="pagoTipo" required class="w-full border rounded px-2 py-1">
          <option value="clase">Por clase</option>
          <option value="mes">Mensual</option>
          <option value="otro">Otro</option>
        </select>
      </div>
      <div id="pagoObsDiv">
        <label class="block font-semibold mb-1">Observación</label>
        <input type="text" id="pagoObs" class="w-full border rounded px-2 py-1" />
      </div>
      <div class="flex justify-end" id="pagoBtnDiv">
        <button type="submit" class="bg-blue-700 text-white px-4 py-1 rounded hover:bg-blue-800 transition">Guardar</button>
      </div>
    </form>
  </div>`;
  modalBg.classList.remove('hidden');
  // Lógica para mostrar/ocultar campos según tipo de pago
  function togglePagoFormFields() {
    const tipo = document.getElementById('pagoTipo').value;
    const esClase = tipo === 'clase';
    document.getElementById('pagoFechaDiv').style.display = esClase ? 'none' : '';
    document.getElementById('pagoMontoDiv').style.display = esClase ? 'none' : '';
    document.getElementById('pagoObsDiv').style.display = esClase ? 'none' : '';
    document.getElementById('pagoBtnDiv').style.display = esClase ? 'none' : '';
    document.getElementById('pagoClaseMsg').style.display = esClase ? '' : 'none';
  }
  document.getElementById('pagoTipo').onchange = togglePagoFormFields;
  togglePagoFormFields();
  document.getElementById('pagoForm').onsubmit = function(e) {
    e.preventDefault();
    const tipo = document.getElementById('pagoTipo').value;
    if (tipo === 'clase') return; // No registrar pagos por clase manualmente
    const fecha = document.getElementById('pagoFecha').value;
    const monto = parseInt(document.getElementById('pagoMonto').value);
    const observacion = document.getElementById('pagoObs').value;
    if (!fecha || !monto || !tipo) return;
    if (!pagosAlumnos[alumnoId]) pagosAlumnos[alumnoId] = [];
    pagosAlumnos[alumnoId].push({fecha, monto, tipo, observacion});
    saveAlumnosToLocal();
    closePagoModal();
    renderAlumnosTabla(month, year);
  };
}
function closePagoModal() {
  document.getElementById('pagoModalBg').classList.add('hidden');
  document.getElementById('pagoModalBg').innerHTML = '';
}

// Reemplazar la función renderReportePagos por la nueva lógica:
function renderReportePagos() {
  if (typeof alumnos === 'undefined' || typeof pagosAlumnos === 'undefined' || typeof asistenciaAlumnos === 'undefined') return;
  // Inicializar arrays de ingresos
  let ingresosPorClase = Array(12).fill(0);
  let ingresosMensuales = Array(12).fill(0);
  let totalPorMes = Array(12).fill(0);
  let pagos = [];
  let pagosPorClasePorAlumno = {};
  let fechasPorClase = new Set();
  alumnos.forEach(al => {
    // Ingresos por clase (solo días asistidos, solo si tipoPago es 'clase')
    if (al.tipoPago === 'clase' && asistenciaAlumnos[al.id]) {
      Object.entries(asistenciaAlumnos[al.id]).forEach(([fecha, estado]) => {
        if (estado === 'ok' || estado === true) { // true para compatibilidad
          const d = new Date(fecha);
          if (!isNaN(d)) {
            ingresosPorClase[d.getMonth()] += al.valor;
            totalPorMes[d.getMonth()] += al.valor;
            if (!pagosPorClasePorAlumno[al.nombre]) pagosPorClasePorAlumno[al.nombre] = {};
            pagosPorClasePorAlumno[al.nombre][fecha] = al.valor;
            fechasPorClase.add(fecha);
          }
        }
      });
    }
    // Ingresos mensuales (pagos registrados, solo si tipoPago es 'mes')
    if (al.tipoPago === 'mes' && pagosAlumnos[al.id]) {
      pagosAlumnos[al.id].forEach(p => {
        const d = new Date(p.fecha);
        if (!isNaN(d)) {
          ingresosMensuales[d.getMonth()] += p.monto;
          totalPorMes[d.getMonth()] += p.monto;
          pagos.push({...p, alumno: al.nombre});
        }
      });
    }
  });
  // Ordenar fechas de asistencia
  let fechasOrdenadas = Array.from(fechasPorClase).sort((a,b) => new Date(a) - new Date(b));
  // Renderizar encabezado dinámico
  let theadHtml = '';
  let html = '';
  if (fechasOrdenadas.length > 0) {
    theadHtml += `<tr class='bg-gray-100'><th class='py-1 px-2'>Alumno</th>`;
    fechasOrdenadas.forEach(f => {
      const fechaTxt = new Date(f).toLocaleDateString('es-ES');
      theadHtml += `<th class='py-1 px-2'>${fechaTxt}</th>`;
    });
    theadHtml += `<th class='py-1 px-2'>Total por clase</th></tr>`;
    Object.entries(pagosPorClasePorAlumno).forEach(([alumno, pagosPorFecha]) => {
      let total = 0;
      html += `<tr><td class='py-1 px-2 font-semibold'>${alumno}</td>`;
      fechasOrdenadas.forEach(f => {
        if (pagosPorFecha[f]) {
          html += `<td class='py-1 px-2'>$${pagosPorFecha[f]}</td>`;
          total += pagosPorFecha[f];
        } else {
          html += `<td class='py-1 px-2'></td>`;
        }
      });
      html += `<td class='py-1 px-2 font-bold'>$${total}</td></tr>`;
    });
    // Fila total general
    html += `<tr class='bg-gray-100'><td class='py-1 px-2 font-bold'>Total</td>`;
    let totalPorFecha = fechasOrdenadas.map(f => {
      let suma = 0;
      Object.values(pagosPorClasePorAlumno).forEach(pagosPorFecha => {
        if (pagosPorFecha[f]) suma += pagosPorFecha[f];
      });
      return suma;
    });
    totalPorFecha.forEach(suma => {
      html += `<td class='py-1 px-2 font-bold'>$${suma > 0 ? suma : ''}</td>`;
    });
    html += `<td class='py-1 px-2 font-bold'>$${totalPorFecha.reduce((a,b)=>a+b,0)}</td></tr>`;
  }
  // Renderizar pagos mensuales y otros debajo
  if (pagos.length > 0) {
    theadHtml += `<tr class='bg-gray-100'><th class='py-1 px-2'>Mes</th><th class='py-1 px-2'>Fecha de pago</th><th class='py-1 px-2'>Alumno</th><th class='py-1 px-2'>Monto</th><th class='py-1 px-2'>Tipo de pago</th><th class='py-1 px-2'>Observación</th></tr>`;
    pagos.forEach(p => {
      const mes = new Date(p.fecha).toLocaleString('es-ES', {month:'long'});
      html += `<tr><td class='py-1 px-2'>${mes}</td><td class='py-1 px-2'>${p.fecha}</td><td class='py-1 px-2'>${p.alumno}</td><td class='py-1 px-2'>$${p.monto}</td><td class='py-1 px-2'>${p.tipo}</td><td class='py-1 px-2'>${p.observacion||''}</td></tr>`;
    });
  }
  document.getElementById('reportePagosTableHead').innerHTML = theadHtml;
  document.getElementById('reportePagosTableBody').innerHTML = html;
  // Gráfica de ingresos por mes (sin cambios)
  const ctx = document.getElementById('ingresosChart').getContext('2d');
  if (window.ingresosChartObj) window.ingresosChartObj.destroy();
  window.ingresosChartObj = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"],
      datasets: [
        {
          label: 'Por clase',
          data: ingresosPorClase,
          backgroundColor: '#22c55e'
        },
        {
          label: 'Mensual',
          data: ingresosMensuales,
          backgroundColor: '#2563eb'
        },
        {
          label: 'Total',
          data: totalPorMes,
          backgroundColor: '#a21caf'
        }
      ]
    },
    options: {
      responsive: true,
      plugins: { legend: { position: 'top' } },
      scales: { y: { beginAtZero: true } }
    }
  });
}

// --- Funciones para guardar y cargar toda la configuración ---
document.addEventListener('DOMContentLoaded', function() {
  // Función para guardar toda la configuración
  if (document.getElementById('guardarTodoBtn')) {
    document.getElementById('guardarTodoBtn').onclick = () => {
      // Recopilar todos los datos de la aplicación
      const configuracionCompleta = {
        // Dashboard principal
        institutions: [],
        attendance: {},
        selectedMonths: [],
        currentYear: new Date().getFullYear(),
        annualReportPeriod: [5, 6, 7, 8, 9, 10],
        
        // Alumnos
        alumnos: alumnos,
        asistenciaAlumnos: asistenciaAlumnos,
        pagosAlumnos: pagosAlumnos,
        
        // Organizador de horarios
        weeklySchedule: [],
        
        // Metadatos
        version: '1.0',
        fechaExportacion: new Date().toISOString(),
        descripcion: 'Configuración completa del Panel de Gestión'
      };
      
      // Cargar datos del dashboard si están disponibles
      try {
        const instData = localStorage.getItem('clases_institutions');
        const attData = localStorage.getItem('clases_attendance');
        const selMonthsData = localStorage.getItem('clases_selectedMonths');
        const yearData = localStorage.getItem('clases_currentYear');
        const periodData = localStorage.getItem('clases_annualReportPeriod');
        
        if (instData) configuracionCompleta.institutions = JSON.parse(instData);
        if (attData) configuracionCompleta.attendance = JSON.parse(attData);
        if (selMonthsData) configuracionCompleta.selectedMonths = JSON.parse(selMonthsData);
        if (yearData) configuracionCompleta.currentYear = JSON.parse(yearData);
        if (periodData) configuracionCompleta.annualReportPeriod = JSON.parse(periodData);
      } catch (e) {
        console.log('No se pudieron cargar datos del dashboard:', e);
      }
      
      // Cargar datos del organizador de horarios si están disponibles
      try {
        const horariosData = localStorage.getItem('weekly-schedule');
        if (horariosData) configuracionCompleta.weeklySchedule = JSON.parse(horariosData);
      } catch (e) {
        console.log('No se pudieron cargar datos de horarios:', e);
      }
      
      // Crear y descargar el archivo
      const dataStr = JSON.stringify(configuracionCompleta, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `panel_gestion_completo_${new Date().toISOString().slice(0,10)}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      alert('✅ Configuración completa guardada exitosamente');
    };
  }

  // Función para cargar toda la configuración
  if (document.getElementById('cargarTodoBtn')) {
    document.getElementById('cargarTodoBtn').onclick = () => {
      document.getElementById('cargarTodoInput').click();
    };
  }

  if (document.getElementById('cargarTodoInput')) {
    document.getElementById('cargarTodoInput').onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = function(evt) {
        try {
          const configuracionCompleta = JSON.parse(evt.target.result);
          
          // Verificar que sea un archivo válido
          if (!configuracionCompleta.version || !configuracionCompleta.alumnos) {
            alert('❌ El archivo no es una configuración válida del Panel de Gestión');
            return;
          }
          
          // Confirmar antes de sobrescribir
          if (!confirm('⚠️ ¿Estás seguro de que quieres cargar esta configuración? Se sobrescribirán todos los datos actuales.')) {
            return;
          }
          
          // Cargar datos de alumnos
          if (configuracionCompleta.alumnos) {
            alumnos = configuracionCompleta.alumnos;
          }
          if (configuracionCompleta.asistenciaAlumnos) {
            asistenciaAlumnos = configuracionCompleta.asistenciaAlumnos;
          }
          if (configuracionCompleta.pagosAlumnos) {
            pagosAlumnos = configuracionCompleta.pagosAlumnos;
          }
          
          // Guardar datos de alumnos
          saveAlumnosToLocal();
          
          // Cargar datos del dashboard
          if (configuracionCompleta.institutions) {
            localStorage.setItem('clases_institutions', JSON.stringify(configuracionCompleta.institutions));
          }
          if (configuracionCompleta.attendance) {
            localStorage.setItem('clases_attendance', JSON.stringify(configuracionCompleta.attendance));
          }
          if (configuracionCompleta.selectedMonths) {
            localStorage.setItem('clases_selectedMonths', JSON.stringify(configuracionCompleta.selectedMonths));
          }
          if (configuracionCompleta.currentYear) {
            localStorage.setItem('clases_currentYear', JSON.stringify(configuracionCompleta.currentYear));
          }
          if (configuracionCompleta.annualReportPeriod) {
            localStorage.setItem('clases_annualReportPeriod', JSON.stringify(configuracionCompleta.annualReportPeriod));
          }
          
          // Cargar datos del organizador de horarios
          if (configuracionCompleta.weeklySchedule) {
            localStorage.setItem('weekly-schedule', JSON.stringify(configuracionCompleta.weeklySchedule));
          }
          
          // Actualizar la interfaz
          if (typeof renderAlumnosPage === 'function') {
            renderAlumnosPage();
          }
          
          alert('✅ Configuración completa cargada exitosamente');
          
        } catch (err) { 
          alert('❌ Error al cargar el archivo: ' + err.message); 
        }
      };
      reader.readAsText(file);
    };
  }
});

// Inicialización
loadAlumnosFromLocal();
if (document.getElementById('alumnosPage')) {
  renderAlumnosPage();
} 