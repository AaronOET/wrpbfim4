// index.js：讀取 geodata.js 中的 shpGeoJSONs（SHP2 目錄下 8 個縣市界圖層），
// 逐一建立 google.maps.Data 圖層並加入自訂圖層控制面板，方便切換顯示。
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

  const infoWindow = new google.maps.InfoWindow();
  const bounds = new google.maps.LatLngBounds();
  const dataLayers = {};

  Object.keys(shpGeoJSONs).forEach((code) => {
    const color = colors[code] || "#666666";
    const dataLayer = new google.maps.Data({ map: gMap });

    dataLayer.addGeoJson(shpGeoJSONs[code]);
    dataLayer.setStyle({
      strokeColor: color,
      strokeWeight: 2,
      fillColor: color,
      fillOpacity: 0.35,
    });

    dataLayer.addListener("click", (event) => {
      const rows = [];
      event.feature.forEachProperty((value, key) => {
        rows.push(`<tr><td>${key}</td><td>${value}</td></tr>`);
      });
      infoWindow.setContent(`<table>${rows.join("")}</table>`);
      infoWindow.setPosition(event.latLng);
      infoWindow.open(gMap);
    });

    dataLayer.forEach((feature) => {
      feature.getGeometry().forEachLatLng((latLng) => bounds.extend(latLng));
    });

    dataLayers[code] = dataLayer;
  });

  // 自訂圖層控制面板（Google Maps API 無內建 LayersControl）
  const controlDiv = document.createElement("div");
  controlDiv.style.background = "#fff";
  controlDiv.style.padding = "8px";
  controlDiv.style.margin = "10px";
  controlDiv.style.fontFamily = "Arial, sans-serif";
  controlDiv.style.fontSize = "13px";
  controlDiv.style.boxShadow = "0 1px 4px rgba(0,0,0,0.3)";

  const toggleAllLabel = document.createElement("label");
  toggleAllLabel.style.display = "block";
  toggleAllLabel.style.whiteSpace = "nowrap";
  toggleAllLabel.style.fontWeight = "bold";
  toggleAllLabel.style.borderBottom = "1px solid #ccc";
  toggleAllLabel.style.marginBottom = "4px";
  toggleAllLabel.style.paddingBottom = "4px";

  const toggleAllCheckbox = document.createElement("input");
  toggleAllCheckbox.type = "checkbox";
  toggleAllCheckbox.checked = true;

  toggleAllLabel.appendChild(toggleAllCheckbox);
  toggleAllLabel.appendChild(document.createTextNode(" 顯示所有圖層"));
  controlDiv.appendChild(toggleAllLabel);

  const layerCheckboxes = [];

  Object.keys(shpGeoJSONs).forEach((code) => {
    const label = document.createElement("label");
    label.style.display = "block";
    label.style.whiteSpace = "nowrap";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = true;
    checkbox.addEventListener("change", () => {
      dataLayers[code].setMap(checkbox.checked ? gMap : null);
      toggleAllCheckbox.checked = layerCheckboxes.every((cb) => cb.checked);
    });

    label.appendChild(checkbox);
    label.appendChild(
      document.createTextNode(` ${countyNames[code] || code} (${code})`),
    );
    controlDiv.appendChild(label);
    layerCheckboxes.push(checkbox);
  });

  toggleAllCheckbox.addEventListener("change", () => {
    layerCheckboxes.forEach((checkbox, index) => {
      checkbox.checked = toggleAllCheckbox.checked;
      const code = Object.keys(shpGeoJSONs)[index];
      dataLayers[code].setMap(toggleAllCheckbox.checked ? gMap : null);
    });
  });

  gMap.controls[google.maps.ControlPosition.TOP_RIGHT].push(controlDiv);

  gMap.fitBounds(bounds);
}
