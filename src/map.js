import React, { useEffect, useRef, useState } from "react";

function Map() {
  const mapRef = useRef(null);
  const [, setMap] = useState(null); 
  const [, setPath] = useState([]); 
  const vehicleRef = useRef(null); 
  const indexRef = useRef(1); 
  const intervalRef = useRef(null); 

  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`;
    script.async = true;

    script.onload = () => {
      fetch("/vehicledata.json")
        .then((res) => res.json())
        .then((data) => {
          if (!data || data.length === 0) return;

          const start = data[0];
          const gMap = new window.google.maps.Map(mapRef.current, {
            zoom: 15,
            center: { lat: start.latitude, lng: start.longitude },
          });

          setMap(gMap);
          setPath([{ lat: start.latitude, lng: start.longitude }]);

          const marker = new window.google.maps.Marker({
            position: { lat: start.latitude, lng: start.longitude },
            map: gMap,
            icon: {
              url: "https://maps.gstatic.com/intl/en_us/mapfiles/markers2/marker.png", 
              scaledSize: new window.google.maps.Size(20, 20)
            },
          });

          vehicleRef.current = marker;

          intervalRef.current = setInterval(() => {
            if (indexRef.current >= data.length) {
              clearInterval(intervalRef.current);
              return;
            }

            const next = data[indexRef.current];
            const position = { lat: next.latitude, lng: next.longitude };

            marker.setPosition(position);
            gMap.panTo(position);

            setPath((oldPath) => {
              const newPath = [...oldPath, position];
              new window.google.maps.Polyline({
                path: newPath,
                geodesic: true,
                strokeColor: "blue",
                strokeOpacity: 1.0,
                strokeWeight: 3,
                map: gMap,
              });
              return newPath;
            });

            indexRef.current += 1;
          }, 2000);
        });
    };

    document.head.appendChild(script);
  },[]);

  return <div ref={mapRef} style={{ height: "100vh", width: "100%" }} />;
}

export default Map;
