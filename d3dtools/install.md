# 安裝說明

d3dtools 可以直接用 pip 從 PyPI 安裝，但在此之前需要先準備好 GDAL 等相依套件的環境。


## Python 安裝

若尚未安裝 Python，建議安裝 [Miniforge](https://github.com/conda-forge/miniforge)，它是精簡版的 Conda 發行版，預設使用 conda-forge 頻道，安裝地理空間相關套件（如 GDAL）時相容性較佳，也比 Anaconda 更輕量。

- 下載頁面：[https://github.com/conda-forge/miniforge/releases](https://github.com/conda-forge/miniforge/releases)
- Windows 使用者可直接下載 `Miniforge3-Windows-x86_64.exe` 並執行安裝精靈。
- 安裝完成後，開啟「Miniforge Prompt」（Windows）或終端機（macOS/Linux），輸入以下指令確認安裝成功：

  ```bash
  conda --version
  python --version
  ```

安裝好 Python（Miniforge）之後，即可依照下列步驟建立環境並安裝 d3dtools。


## 安裝前準備

- 建議使用 Conda 建立獨立的 Python 環境（例如 `d3dtools_env`），以避免與其他專案的套件衝突。 
- d3dtools 依賴 GDAL，必須先安裝 GDAL 後再安裝 d3dtools。


## Option1: 使用環境檔案（YAML）快速安裝

若不想手動逐一安裝相依套件，可以直接使用專案提供的 Conda 環境檔案 `d3dtoolsenv.yaml` 一次建立好包含 GDAL 等相依套件的環境（環境名稱為 `d3dtoolsenv`）。

1. 下載環境檔案  
   ```bash
   curl -o d3dtoolsenv.yaml https://raw.githubusercontent.com/AaronOET/d3dtools/refs/heads/main/d3dtoolsenv.yaml
   ```

2. 用該檔案建立 Conda 環境  
   ```bash
   conda env create -f d3dtoolsenv.yaml
   conda activate d3dtoolsenv
   ```  
   此檔案已定義好 Python 版本與 GDAL、geopandas、rasterio 等地理空間相關套件，建立完成後即可直接使用，不需再手動安裝 GDAL。

3. 安裝 d3dtools  
   ```bash
   pip install d3dtools
   ```


## Option2: 在 Conda 環境中安裝

1. 建立並啟用 Conda 環境（範例）  
   ```bash
   conda create --name d3dtools_env python=3.11 -y
   conda activate d3dtools_env
   ```  
   Conda 的獨立環境可以讓 Delft3D 相關工具的方程式與 I/O 套件集中在同一個環境管理。 

2. 安裝 GDAL  
   ```bash
   conda install gdal
   ```  
   這是在 Conda 環境中安裝 GDAL 的推薦做法，安裝過程會自動處理相依的空間分析函式庫與格式轉換工具。

3. 安裝 d3dtools  
   ```bash
   pip install d3dtools
   ```  
   預設會安裝 PyPI 上的最新版本，包含 shapefile 轉換至 Delft3D 模型所需的各種工具。


## Option3: 在非 Conda（系統 Python、venv）環境中安裝

1. 建立 venv（可選，但建議）  
   ```bash
   python -m venv d3dtools_env
   source d3dtools_env/bin/activate  # Linux/macOS
   d3dtools_env\Scripts\activate     # Windows
   ```  

2. 安裝 GDAL  
   - 由於 GDAL 編譯較複雜，官方建議在非 Conda 環境中直接使用預編譯的 wheel 檔。  
   - 可從 Christoph Gohlke 提供的 geospatial wheels 下載對應版本的 GDAL wheel，然後用 pip 安裝：
     ```bash
     pip install path/to/GDAL‑<version>‑cp<pythonver>‑<platform>.whl
     ```

3. 安裝 d3dtools  
   ```bash
   pip install d3dtools
   ```  
   安裝完成後，Python 會在此環境中註冊 d3dtools 套件以供後續方程式與資料處理腳本引用。


## 測試安裝是否成功

1. 在命令列查看套件資訊  
   ```bash
   d3dtools-info --version
   d3dtools-info --help
   ```  
   `d3dtools-info` 是套件附帶的指令工具，可用來檢查安裝版本以及列出可用的轉檔工具。

2. 在 Python 互動環境中載入  
   ```python
   import d3dtools
   print(d3dtools.__version__)
   ```  
   若可以正常 import 並印出版本號，代表 d3dtools 與其相依套件（包含 GDAL）已正確安裝。
