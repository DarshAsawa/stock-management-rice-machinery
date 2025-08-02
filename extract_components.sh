#!/bin/bash

# Extract all remaining components from git history

echo "Extracting components from git history..."

# GateInwardForm (1290-1460)
git show HEAD~2:frontend/src/App.js | sed -n '1290,1460p' > temp_gateinward.js

# IssueNoteInternalForm (1461-1719)
git show HEAD~2:frontend/src/App.js | sed -n '1461,1719p' > temp_issuenote.js

# InwardInternalForm (1720-2029)
git show HEAD~2:frontend/src/App.js | sed -n '1720,2029p' > temp_inwardinternal.js

# OutwardChallanForm (2030-2274)
git show HEAD~2:frontend/src/App.js | sed -n '2030,2274p' > temp_outwardchallan.js

# StockControlPage (2275-2454)
git show HEAD~2:frontend/src/App.js | sed -n '2275,2454p' > temp_stockcontrol.js

# PartyOverviewPage (2455-2533)
git show HEAD~2:frontend/src/App.js | sed -n '2455,2533p' > temp_partyoverview.js

# ItemCatalogOverviewPage (2534-2611)
git show HEAD~2:frontend/src/App.js | sed -n '2534,2611p' > temp_itemcatalog.js

# ProductionOverviewPage (2612-2739)
git show HEAD~2:frontend/src/App.js | sed -n '2612,2739p' > temp_productionoverview.js

# DispatchOverviewPage (2740-2817)
git show HEAD~2:frontend/src/App.js | sed -n '2740,2817p' > temp_dispatchoverview.js

# RecordedEntriesPage (2818-3280)
git show HEAD~2:frontend/src/App.js | sed -n '2818,3280p' > temp_recordedentries.js

# ProductionFloorStockPage (3281-3401)
git show HEAD~2:frontend/src/App.js | sed -n '3281,3401p' > temp_productionfloorstock.js

echo "All components extracted to temporary files." 