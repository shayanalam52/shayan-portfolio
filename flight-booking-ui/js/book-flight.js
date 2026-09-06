(function () {
  const roundTripBtn = document.getElementById('round-trip-btn');
  const oneWayBtn = document.getElementById('one-way-btn');
  const swapBtn = document.getElementById('swap-btn');
  const searchBtn = document.getElementById('search-btn');
  const form = document.getElementById('flight-form');

  const routeFields = document.querySelectorAll('.route-fields .input-field');
  const originField = routeFields[0];
  const destinationField = routeFields[1];
  const returnGroup = document.querySelectorAll('.field-row')[0].children[1];

  const DEFAULT_ORIGIN = { code: 'DEL', value: 'New Delhi' };

  function readCity(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  }

  function writeCity(key, city) {
    localStorage.setItem(key, JSON.stringify(city));
  }

  function renderField(field, city, placeholder) {
    const codeEl = field.querySelector('.code');
    const valueEl = field.querySelector('.value');
    if (city) {
      codeEl.textContent = city.code;
      valueEl.textContent = city.value;
    } else {
      codeEl.textContent = placeholder.code;
      valueEl.textContent = placeholder.value;
    }
  }

  function updateSearchState() {
    const destination = readCity('flight_destination', null);
    searchBtn.disabled = !destination;
  }

  // Trip type toggle
  function setTripType(type) {
    const isRoundTrip = type === 'round-trip';
    roundTripBtn.classList.toggle('pill--active', isRoundTrip);
    roundTripBtn.setAttribute('aria-selected', String(isRoundTrip));
    oneWayBtn.classList.toggle('pill--active', !isRoundTrip);
    oneWayBtn.setAttribute('aria-selected', String(!isRoundTrip));
    returnGroup.style.display = isRoundTrip ? '' : 'none';
    localStorage.setItem('flight_trip_type', type);
  }

  roundTripBtn.addEventListener('click', () => setTripType('round-trip'));
  oneWayBtn.addEventListener('click', () => setTripType('one-way'));

  // Swap origin/destination
  swapBtn.addEventListener('click', () => {
    const origin = readCity('flight_origin', DEFAULT_ORIGIN);
    const destination = readCity('flight_destination', null);
    if (!destination) return;
    writeCity('flight_origin', destination);
    writeCity('flight_destination', origin);
    renderField(originField, destination, DEFAULT_ORIGIN);
    renderField(destinationField, origin, { code: 'To', value: 'City' });
    updateSearchState();
  });

  // Navigate to city picker
  destinationField.addEventListener('click', () => {
    window.location.href = 'select-destination.html';
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const origin = readCity('flight_origin', DEFAULT_ORIGIN);
    const destination = readCity('flight_destination', null);
    if (!destination) return;
    alert(`Searching flights: ${origin.code} → ${destination.code}`);
  });

  // Init from stored state
  const storedTripType = localStorage.getItem('flight_trip_type') || 'round-trip';
  setTripType(storedTripType);
  renderField(originField, readCity('flight_origin', DEFAULT_ORIGIN), DEFAULT_ORIGIN);
  renderField(destinationField, readCity('flight_destination', null), { code: 'To', value: 'City' });
  updateSearchState();
})();
