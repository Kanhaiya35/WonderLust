// Mapbox access token (comes from show.ejs)
mapboxgl.accessToken = mapToken;

// Safety check: ensure listing object and geometry exist
if (!listing || !listing.geometry || !listing.geometry.coordinates) {
  console.error("Invalid listing data or coordinates missing:", listing);
  document.getElementById("map").innerHTML = 
    '<div class="alert alert-warning m-3">Map location not available</div>';
} else {
  const coordinates = listing.geometry.coordinates;

  // Additional validation for coordinates array
  if (!Array.isArray(coordinates) || coordinates.length !== 2) {
    console.error("Invalid coordinates format:", coordinates);
    document.getElementById("map").innerHTML = 
      '<div class="alert alert-warning m-3">Invalid map coordinates</div>';
  } else {
    try {
      // Create map
      const map = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/streets-v12",
        center: coordinates, // [lng, lat]
        zoom: 9
      });

      map.addControl(new mapboxgl.NavigationControl());

      const marker = new mapboxgl.Marker({ color: "red" })
        .setLngLat(coordinates)
        .setPopup(
          new mapboxgl.Popup({ offset: 25 })
            .setHTML(
              `<div style="padding: 5px;">
                <h6 style="margin: 0; font-weight: bold;">${listing.title || 'Listing Location'}</h6>
                <p style="margin: 5px 0 0 0; font-size: 0.9em;">${listing.location || ''}</p>
              </div>`
            )
        )
        .addTo(map);

    } catch (error) {
      console.error("Error initializing map:", error);
      document.getElementById("map").innerHTML = 
        '<div class="alert alert-danger m-3">Failed to load map. Please try again later.</div>';
    }
  }
}