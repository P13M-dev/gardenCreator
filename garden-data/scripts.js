const exportedGardenData = JSON.parse(localStorage.getItem('exportedGardenData'));
let plantsObject;

if (exportedGardenData && Array.isArray(exportedGardenData.objects)) {
  const objects = exportedGardenData.objects;

  // Count occurrences of each modelType
  const modelTypeCounts = objects.reduce((counts, obj) => {
    if (obj.modelType) {
      counts[obj.modelType] = (counts[obj.modelType] || 0) + 1;
    }
    return counts;
  }, {});

  // Load Google Charts
  google.charts.load('current', { packages: ['corechart'] });
  google.charts.setOnLoadCallback(() => drawCharts().then(sendToAPI));

  async function loadPlantDataFromCSV() {
    const response = await fetch('../plants.csv');
    let csvData = await response.text();

    csvData = csvData.replace(/<\/?[^>]+(>|$)/g, ""); // Clean unexpected HTML tags

    const lines = csvData.split('\n').slice(1).map(line => line.trim()).filter(line => line);
    const data = [];

    for (const line of lines) {
      const columns = line.match(/(".*?"|[^",\n]+)(?=\s*,|\s*$)/g);
      const [name, description, type, oxygenProduction, plantType, waterRequirement, sunlightRequirement, realHeight] = columns;

      data.push({
        name,
        oxygenProduction: parseFloat(oxygenProduction),
        waterRequirement: parseFloat(waterRequirement),
        sunlightRequirement: parseFloat(sunlightRequirement),
      });
    }

    return data;
  }

  async function drawCharts() {
    // Load CSV plant data
    const csvData = await loadPlantDataFromCSV();

    // Filter CSV data for plant types present in `modelTypeCounts`
    const filteredData = csvData.filter(plant => modelTypeCounts[plant.name]);

    // Calculate total values based on plant occurrences
    const aggregatedData = filteredData.map(plant => ({
      name: plant.name,
      oxygenProduction: plant.oxygenProduction * modelTypeCounts[plant.name],
      waterRequirement: plant.waterRequirement * modelTypeCounts[plant.name],
      count: modelTypeCounts[plant.name]
    }));

    // Assign aggregatedData to plantData
    const plantData = aggregatedData;

    // Draw the charts
    drawBarChart(aggregatedData);
    drawPieChart(aggregatedData);
    drawWaterChart(aggregatedData);

    // Return plantData to be used for the API call
    return plantData;
  }

  function drawBarChart(aggregatedData) {
    const countData = google.visualization.arrayToDataTable(
      [['Typ rośliny', 'Ilość']].concat(aggregatedData.map(plant => [plant.name, plant.count]))
    );

    const countOptions = {
      title: '',
      chartArea: { width: '80%', height: '80%' },
      bars: 'vertical',
      colors: ['#4299E1'],
      legend: { position: 'none' },
    };

    const countChart = new google.visualization.BarChart(document.getElementById('barChart'));
    countChart.draw(countData, countOptions);
  }

  function drawPieChart(aggregatedData) {
    const oxygenData = google.visualization.arrayToDataTable(
      [['Typ rośliny', 'Produkcja tlenu']].concat(aggregatedData.map(plant => [plant.name, plant.oxygenProduction]))
    );

    const oxygenOptions = {
      title: '',
      chartArea: { width: '80%', height: '80%' },
      pieHole: 0,
      colors: ['#4CAF50', '#FFC107', '#2196F3']
    };

    const oxygenChart = new google.visualization.PieChart(document.getElementById('oxygenChart'));
    oxygenChart.draw(oxygenData, oxygenOptions);
  }

  function drawWaterChart(aggregatedData) {
    const waterData = google.visualization.arrayToDataTable(
      [['Typ rośliny', 'Zapotrzebowanie na wodę']].concat(aggregatedData.map(plant => [plant.name, plant.waterRequirement]))
    );

    const waterOptions = {
      title: '',
      chartArea: { width: '80%', height: '80%' },
      bars: 'horizontal',
      colors: ['#00796B'],
      legend: { position: 'none' }
    };

    const waterChart = new google.visualization.BarChart(document.getElementById('waterChart'));
    waterChart.draw(waterData, waterOptions);
  }

  async function sendToAPI(plantData) {
    //const payload = `You are provided with some data about a garden the user has created. The garden is set most often in Europe or North America. Here is the data: ${JSON.stringify(plantData)}. It is in the format: Plant name, Oxygen production [in kg/m2 of leaves], water requirements, amount of plants of that type in the garden. Tell the end user that data, and give a semi-long comment, praising the garden creation. Give some tips that might be valid in terms of ecology. The answer should be structured like: 1st paragraph: garden praise. 2nd paragraph: the comment on the garden. 3rd paragraph: ecological tips. Do not give info about the garden you've got provided, the user already has it.`;
    const payload = `Otrzymujesz pewne dane na temat ogrodu utworzonego przez użytkownika. Ogród umiejscowiony jest najczęściej w Europie lub Ameryce Północnej. Oto dane: ${JSON.stringify(plantData)}. Podaje się go w formacie: nazwa rośliny, produkcja tlenu [w kg/m2 liści], zapotrzebowanie na wodę, ilość roślin danego typu w ogrodzie. Przekaż użytkownikowi końcowemu te dane i wyraź półdługi komentarz, w którym pochwalisz stworzenie ogrodu. Podaj kilka wskazówek, które mogą być ważne z punktu widzenia ekologii. Odpowiedź powinna mieć następującą strukturę: 1. akapit: pochwała ogrodu. 2. akapit: komentarz do ogrodu. 3. akapit: porady ekologiczne. Nie podawaj informacji o podanym ogrodzie, użytkownik już go posiada. NAPISZ ODPOWIEDŹ W JĘZYKU POLSKIM. Upewnij się, że używasz prawidłowej gramatyki. Nie rozpoczynaj jej słowami typu "Oto moja odpowiedź" lub temu podobnymi. `
    const response = await getGroqResponse(payload);
    console.log(response);
    document.getElementById("aiBox").innerText = response;
  }

  async function getGroqResponse(payload) {
    const apiKey = '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'; // Replace with your actual API key
    const url = "https://api.groq.com/openai/v1/chat/completions";
  
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messages: [{ role: "user", content: payload }],
        model: "llama3-70b-8192"
      })
    });
  
    if (!response.ok) {
      console.error("Error:", response.statusText);
      return;
    }
  
    const data = await response.json();
    return data.choices[0].message.content;
  }

} else {
  console.error("Invalid or missing 'objects' array in data.");
}
