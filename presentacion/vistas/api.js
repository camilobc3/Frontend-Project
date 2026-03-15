(function(){
    const regionSelect = document.getElementById('region');
    const fallbackRegions = ['Andina','Caribe','Pacífica','Orinoquía','Amazonía','Insular'];

    function populateSelect(list){
        if(!regionSelect) return;
        regionSelect.innerHTML = '<option value="">Selecciona una región</option>';
        list.forEach(r => {
            const opt = document.createElement('option');
            opt.value = r;
            opt.textContent = r;
            regionSelect.appendChild(opt);
        });
    }

    fetch("https://api-colombia.com/api/v1/Region")
    .then(response => response.json())
    .then(data => {
        let regions = [];
        if (Array.isArray(data) && data.length){
            regions = data.map(item => {
                if (typeof item === 'string') return item;
                return item.name || item.nombre || item.region || item.nombreRegion || JSON.stringify(item);
            }).filter(Boolean);
        }
        if (!regions.length) regions = fallbackRegions;
        populateSelect(regions);
    })
    .catch(error => {
        console.error('Error cargando regiones:', error);
        populateSelect(fallbackRegions);
    });
})();