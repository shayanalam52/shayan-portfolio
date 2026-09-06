(function () {
  const CITIES = [
    { code: 'DEL', name: 'Delhi', airport: 'Indira Gandhi International Airport', image: 'assets/images/city-del.png' },
    { code: 'HYD', name: 'Hyderabad', airport: 'Rajiv Gandhi International Airport', image: 'assets/images/city-hyd.png' },
    { code: 'GOX', name: 'Goa', airport: 'Manohar International Airport', image: 'assets/images/city-gox.png' },
    { code: 'GOI', name: 'Goa', airport: 'Dabolim International Airport', image: 'assets/images/city-goi.png' },
    { code: 'BLR', name: 'Bangalore', airport: 'Kempegowda International Airport Bangalore', image: 'assets/images/city-blr.png' },
    { code: 'CCU', name: 'Kolkata', airport: 'Netaji Subhash Chandra Bose International Airport', image: 'assets/images/city-ccu.png' },
    { code: 'MAA', name: 'Chennai', airport: 'Chennai International Airport', image: 'assets/images/city-maa.png' },
    { code: 'AMD', name: 'Ahmedabad', airport: 'Ahmedabad Airport', image: 'assets/images/city-amd.png' },
    { code: 'DXB', name: 'Dubai', airport: 'Dubai International Airport', image: 'assets/images/city-dxb.png' },
  ];

  const DEFAULT_ORIGIN = { code: 'VTZ', value: 'Visakhapatnam' };

  const cityList = document.getElementById('city-list');
  const originField = document.getElementById('origin-field');
  const destinationField = document.getElementById('destination-field');
  const swapBtn = document.getElementById('swap-btn');

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
      valueEl.classList.remove('value--ghost');
    } else {
      codeEl.textContent = placeholder.code;
      valueEl.textContent = placeholder.value;
      valueEl.classList.add('value--ghost');
    }
  }

  function renderCityList() {
    cityList.innerHTML = '';
    CITIES.forEach((city) => {
      const li = document.createElement('li');
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'city-row';

      const img = document.createElement('img');
      img.className = 'city-thumb';
      img.src = city.image;
      img.alt = city.name;

      const info = document.createElement('div');
      info.className = 'city-info';
      const name = document.createElement('p');
      name.className = 'city-name';
      name.textContent = city.name;
      const airport = document.createElement('p');
      airport.className = 'city-airport';
      airport.textContent = city.airport;
      info.append(name, airport);

      const code = document.createElement('p');
      code.className = 'city-code';
      code.textContent = city.code;

      btn.append(img, info, code);
      li.appendChild(btn);
      cityList.appendChild(li);

      btn.addEventListener('click', () => {
        writeCity('flight_destination', { code: city.code, value: city.name });
        window.location.href = 'book-flight.html';
      });
    });
  }

  originField.addEventListener('click', () => {
    window.location.href = 'book-flight.html';
  });

  swapBtn.addEventListener('click', () => {
    const origin = readCity('flight_origin', DEFAULT_ORIGIN);
    const destination = readCity('flight_destination', null);
    if (!destination) return;
    writeCity('flight_origin', destination);
    writeCity('flight_destination', origin);
    renderField(originField, destination, DEFAULT_ORIGIN);
    renderField(destinationField, origin, { code: 'To', value: 'City' });
  });

  renderField(originField, readCity('flight_origin', DEFAULT_ORIGIN), DEFAULT_ORIGIN);
  renderField(destinationField, readCity('flight_destination', null), { code: 'To', value: 'City' });
  renderCityList();
})();
