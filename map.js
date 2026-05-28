/* --------------------------
   Map Init
---------------------------*/

const map = L.map("map").setView(
    [28.1,30.75],
    17
);

/* --------------------------
   Map Layers
---------------------------*/

const normalLayer = L.tileLayer(

    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",

    {

        attribution:
            "&copy; OpenStreetMap"

    }

);

const satelliteLayer = L.tileLayer(

    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",

    {

        attribution:
            "Tiles &copy; Esri"

    }

);

/* --------------------------
   Default Layer
---------------------------*/

normalLayer.addTo(map);

let satelliteEnabled = false;

/* --------------------------
   Satellite Toggle
---------------------------*/

const satelliteBtn =
    document.getElementById(
        "satelliteBtn"
    );

satelliteBtn.addEventListener(
    "click",
    toggleSatellite
);

function toggleSatellite(){

    if(!satelliteEnabled){

        map.removeLayer(
            normalLayer
        );

        satelliteLayer.addTo(map);

        satelliteEnabled = true;

        satelliteBtn.innerText =
            "Normal Map";

        satelliteBtn.classList.add(
            "satellite-active"
        );

    }else{

        map.removeLayer(
            satelliteLayer
        );

        normalLayer.addTo(map);

        satelliteEnabled = false;

        satelliteBtn.innerText =
            "Satellite Mode";

        satelliteBtn.classList.remove(
            "satellite-active"
        );

    }

}

/* --------------------------
   Icons
---------------------------*/

const userIcon = L.divIcon({

    className:"",

    html:`

        <div class="user-marker">

            <div class="user-dot"></div>

            <div class="user-pulse"></div>

        </div>

    `,

    iconSize:[34,34],

    iconAnchor:[17,17]

});

const targetIcon = L.divIcon({

    className:"",

    html:`

        <div class="target-marker">

            📍

        </div>

    `,

    iconSize:[36,36],

    iconAnchor:[18,36]

});

const savedIcon = L.divIcon({

    className:"",

    html:`

        <div class="saved-marker">

            ⭐

        </div>

    `,

    iconSize:[30,30],

    iconAnchor:[15,30]

});

/* --------------------------
   Global Markers
---------------------------*/

let savedMarkers = [];

/* --------------------------
   Update Map
---------------------------*/

function updateMap(
    lat,
    lng
){

    /* USER MARKER */

    if(!userMarker){

        userMarker = L.marker(

            [lat,lng],

            {
                icon:userIcon
            }

        )

        .addTo(map)

        .bindTooltip(

            "YOU",

            {

                permanent:true,

                direction:"top",

                offset:[0,-18]

            }

        );

    }else{

        userMarker.setLatLng(
            [lat,lng]
        );

    }

    /* TARGET MARKER */

    if(
        targetLat !== null &&
        targetLng !== null
    ){

        if(!targetMarker){

            targetMarker = L.marker(

                [

                    targetLat,
                    targetLng

                ],

                {
                    icon:targetIcon
                }

            )

            .addTo(map)

            .bindTooltip(

                "TARGET",

                {

                    permanent:true,

                    direction:"top",

                    offset:[0,-30]

                }

            );

        }else{

            targetMarker.setLatLng(

                [

                    targetLat,
                    targetLng

                ]

            );

        }

    }

    /* LINE */

    if(linePath){

        map.removeLayer(
            linePath
        );

    }

    if(
        targetLat !== null &&
        targetLng !== null
    ){

        linePath = L.polyline(

            [

                [lat,lng],

                [
                    targetLat,
                    targetLng
                ]

            ],

            {

                color:"#00d9ff",

                weight:5,

                opacity:0.9,

                dashArray:"12,12",

                lineCap:"round"

            }

        ).addTo(map);

    }

    /* AUTO CENTER */

    map.setView(

        [lat,lng],

        19,

        {

            animate:true,

            duration:1

        }

    );

}

/* --------------------------
   Render Saved Markers
---------------------------*/

function renderSavedMarkers(){

    /* REMOVE OLD */

    savedMarkers.forEach(marker => {

        map.removeLayer(marker);

    });

    savedMarkers = [];

    /* ADD NEW */

    savedLocations.forEach(location => {

        const marker = L.marker(

            [

                location.lat,
                location.lng

            ],

            {
                icon:savedIcon
            }

        )

        .addTo(map)

        .bindTooltip(

            location.name,

            {

                permanent:false,

                direction:"top"

            }

        );

        marker.on(

            "click",

            () => {

                targetLat =
                    location.lat;

                targetLng =
                    location.lng;

                statusText.innerText =
                    "TARGET SELECTED";

                updateMap(
                    currentLat,
                    currentLng
                );

            }

        );

        savedMarkers.push(marker);

    });

}