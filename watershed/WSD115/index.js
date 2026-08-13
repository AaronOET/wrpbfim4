// index.js：讀取 geodata.js 中的 shpGeoJSONs（SHP2 目錄下 8 個縣市界圖層），
// 逐一建立 L.geoJSON 圖層並加入圖層控制器（LayersControl），方便切換顯示。
{
  const countyNames = {
    HUA: "花蓮縣",
    NAN: "南投縣",
    NWT: "新北市",
    TAO: "桃園市",
    TNN: "台南市",
    TPE: "台北市",
    TTT: "台東縣",
    YUN: "雲林縣",
  };

  const colors = {
    HUA: "#e6194b",
    NAN: "#3cb44b",
    NWT: "#4363d8",
    TAO: "#ff6600",
    TNN: "#911eb4",
    TPE: "#42d4f4",
    TTT: "#f58231",
    YUN: "#bfef45",
  };

  const overlays = {};
  const allLayers = [];

  Object.keys(shpGeoJSONs).forEach((code) => {
    const color = colors[code] || "#666666";
    const layer = L.geoJSON(shpGeoJSONs[code], {
      style: {
        color,
        weight: 2,
        fillColor: color,
        fillOpacity: 0.35,
      },
      onEachFeature: (feature, layer) => {
        const props = feature.properties || {};
        const rows = Object.entries(props)
          .map(([key, value]) => `<tr><td>${key}</td><td>${value}</td></tr>`)
          .join("");
        layer.bindPopup(`<table>${rows}</table>`);
      },
    }).addTo(lMap);

    overlays[`${countyNames[code] || code} (${code})`] = layer;
    allLayers.push(layer);
  });

  L.control.layers(null, overlays, { collapsed: false }).addTo(lMap);

  const bounds = allLayers.reduce(
    (acc, layer) => acc.extend(layer.getBounds()),
    L.latLngBounds([]),
  );
  lMap.fitBounds(bounds);
}
