// arrival-filter.js

const API_URL = '/.netlify/functions/supplier-references'

// Object map → { supplier_name: reference_time }
let supplierReferenceMap = {}

/* ===========================
   LOAD SUPPLIER REFERENCES
=========================== */
async function loadSupplierReferences() {
  try {
    const res = await fetch(API_URL)
    const data = await res.json()

    supplierReferenceMap = {}

    data.forEach(item => {
      supplierReferenceMap[item.supplier_name] = item.reference_time
    })

    populateArrivalSupplier()
  } catch (err) {
    console.error('Gagal load supplier references:', err)
  }
}

/* ===========================
   POPULATE FILTER DROPDOWN
=========================== */
function populateArrivalSupplier() {
  const select = document.getElementById('arrival-supplier')
  if (!select) return

  select.innerHTML = `<option value="">Pilih Supplier</option>`

  Object.keys(supplierReferenceMap).forEach(name => {
    const opt = document.createElement('option')
    opt.value = name
    opt.textContent = `${name} (${supplierReferenceMap[name]})`
    select.appendChild(opt)
  })
}

/* ===========================
   FILTER ACTION
=========================== */
function filterArrival() {
  const select = document.getElementById('arrival-supplier')
  const supplierName = select.value

  if (!supplierName) return

  const referenceTime = supplierReferenceMap[supplierName]

  console.log('Supplier:', supplierName)
  console.log('Reference Time:', referenceTime)

  // 👉 lanjutkan filter kedatangan di sini
}

/* ===========================
   INIT
=========================== */
document.addEventListener('DOMContentLoaded', loadSupplierReferences)

// expose function to HTML
window.filterArrival = filterArrival
