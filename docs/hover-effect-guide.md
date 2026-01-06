# Hover Effect Implementation Guide

This document explains how the system-wide hover effect works and how to exclude specific elements from it.

## Overview

The hover effect is implemented using CSS classes and applies a background color of `#ECEEF4` to all clickable elements when hovered.

## How it Works

1. The `hover-enabled` class is added to the `<body>` element in `src/main.ts`
2. CSS rules target clickable elements within elements with the `hover-enabled` class
3. Elements with the `no-hover` class are excluded from the hover effect

## Excluding Elements from Hover Effect

### Method 1: Add `no-hover` class to individual elements
```html
<button class="no-hover">This button won't have hover effect</button>
<a href="#" class="no-hover">This link won't have hover effect</a>
```

### Method 2: Wrap elements in a container with `no-hover-container` class
```html
<div class="no-hover-container">
  <button>None of these buttons will have hover effect</button>
  <a href="#">Neither will this link</a>
  <input type="button" value="Or this button">
</div>
```

### Method 3: Map-specific exclusions (already implemented)
The following map-related elements are automatically excluded from hover effects:
- `.maplibregl-map` - The map container and all its children
- `.mapboxgl-marker` - Map markers
- `.mapboxgl-popup` - Map popups

## Automatically Excluded Elements

The following elements are automatically excluded from the hover effect:
- All elements within `.maplibregl-map`
- All elements within `.mapboxgl-marker`
- All elements within `.mapboxgl-popup`
- All elements within any container with `no-hover-container` class
- Any element with the `no-hover` class

## Supported Clickable Elements

The hover effect applies to:
- `<button>` elements
- Elements with `role="button"`
- `<a>` links
- `<input type="button">`
- `<input type="submit">`
- Elements with `.tw-button` or `.tw-btn` classes
- Elements with `.clickable` class
- Elements with `onclick` attribute
- Elements with `data-clickable` attribute

## Adding New Exclusions

To exclude new types of elements, add them to the exclusion rules in `src/style.css`:

```css
/* Add to the exclusion list */
.your-new-element button:hover,
.your-new-element [role="button"]:hover,
/* ... other selectors ... */
{
  background-color: transparent !important;
}
```

## Example Usage

```vue
<template>
  <!-- This button will have hover effect -->
  <button @click="save">Save</button>
  
  <!-- This button won't have hover effect -->
  <button @click="cancel" class="no-hover">Cancel</button>
  
  <!-- None of these will have hover effect -->
  <div class="no-hover-container">
    <button>Button 1</button>
    <button>Button 2</button>
    <a href="#">Link</a>
  </div>
  
  <!-- Map elements are automatically excluded -->
  <div id="map" class="maplibregl-map">
    <!-- Buttons in map won't have hover effect -->
  </div>
</template>
```
