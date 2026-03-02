# Migration Guide: Converting Profile Pages to Responsive Design

This guide will help you convert existing profile pages to use the new responsive design system.

## Quick Start

### 1. Basic Migration Steps

For each profile page (Event, Organizer, Talent, Venue):

1. **Import the responsive layout component**:
```vue
import ResponsiveProfileLayout from '@/components/layout/ResponsiveProfileLayout.vue'
import ResponsiveTabs from '@/components/ResponsiveTabs.vue'
```

2. **Wrap your template**:
```vue
<template>
  <ResponsiveProfileLayout
    :pageTitle="'Your Page Title'"
    :menuItems="menuItems"
    :activeItem="activeItem"
    @menu-click="handleMenuClick"
  >
    <template #sidebar>
      <YourSidebarComponent />
    </template>
    
    <template #content>
      <!-- Your existing content here -->
    </template>
  </ResponsiveProfileLayout>
</template>
```

3. **Replace tabs with ResponsiveTabs**:
```vue
<!-- Replace this -->
<div class="tw:flex tw:gap-8 tw:border-b tw:border-gray-200">
  <button v-for="tab in tabs" :key="tab.id">{{ tab.label }}</button>
</div>

<!-- With this -->
<ResponsiveTabs
  :tabs="tabs"
  :initial-tab="activeTab"
  @tab-change="activeTab = $event"
>
  <template #default="{ activeTab }">
    <!-- Your tab content -->
  </template>
</ResponsiveTabs>
```

## Detailed Migration Examples

### Example 1: EventOrganiserPremiumSettings.vue

**Before**:
```vue
<template>
  <div class="tw:min-h-screen tw:bg-gray-50 tw:flex tw:justify-center tw:py-10 tw:px-6">
    <div class="tw:w-full tw:max-w-7xl tw:flex tw:gap-6">
      <EventSidebar :menuItems="menuItems" @back="handleBack" />
      
      <div class="tw:flex-1 tw:bg-[#F6F1E7] tw:rounded-3xl tw:p-6">
        <div class="tw:bg-white tw:rounded-2xl tw:p-8">
          <h1>Organiser Settings</h1>
          
          <!-- Tabs -->
          <div class="tw:flex tw:gap-8 tw:border-b tw:border-gray-200">
            <button v-for="tab in tabs" :key="tab.id">{{ tab.label }}</button>
          </div>
          
          <!-- Content -->
          <div>
            <!-- Your content -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
```

**After**:
```vue
<template>
  <ResponsiveProfileLayout
    :pageTitle="'Organiser Settings'"
    :menuItems="menuItems"
    :activeItem="activeMenuItem"
    @menu-click="handleMenuClick"
  >
    <template #sidebar>
      <EventSidebar :menuItems="menuItems" @back="handleBack" @event-selected="handleEventSelected" />
    </template>
    
    <template #content>
      <div class="tw:w-full tw:max-w-7xl tw:mx-auto">
        <h1 class="tw:text-2xl sm:tw:text-3xl tw:font-bold tw:text-[#2563eb] tw:mb-2">
          Organiser Settings
        </h1>
        
        <ResponsiveTabs
          :tabs="tabs"
          :initial-tab="activeTab"
          @tab-change="activeTab = $event"
        >
          <template #default="{ activeTab }">
            <!-- Your tab content -->
          </template>
        </ResponsiveTabs>
      </div>
    </template>
  </ResponsiveProfileLayout>
</template>

<script setup>
import ResponsiveProfileLayout from '@/components/layout/ResponsiveProfileLayout.vue'
import ResponsiveTabs from '@/components/ResponsiveTabs.vue'
// ... other imports
</script>
```

### Example 2: Form Sections

**Before**:
```vue
<div class="tw:grid tw:grid-cols-2 tw:gap-4">
  <div>
    <label>Field 1</label>
    <input type="text" class="tw:w-full tw:px-4 tw:py-2" />
  </div>
  <div>
    <label>Field 2</label>
    <input type="text" class="tw:w-full tw:px-4 tw:py-2" />
  </div>
</div>
```

**After**:
```vue
<ResponsiveForm
  :sections="[
    {
      title: 'Section Title',
      fields: [
        {
          name: 'field1',
          label: 'Field 1',
          type: 'text',
          placeholder: 'Enter field 1'
        },
        {
          name: 'field2',
          label: 'Field 2',
          type: 'text',
          placeholder: 'Enter field 2'
        }
      ]
    }
  ]"
  :initialData="formData"
  @submit="handleSubmit"
  @input="handleInput"
/>
```

### Example 3: Card Layouts

**Before**:
```vue
<div class="tw:grid tw:grid-cols-3 tw:gap-6">
  <div v-for="item in items" :key="item.id" class="tw:bg-white tw:rounded-lg tw:p-4">
    <!-- Card content -->
  </div>
</div>
```

**After**:
```vue
<div class="responsive-card-deck">
  <div v-for="item in items" :key="item.id" class="tw-bg-white tw:rounded-lg tw:p-4 tw-shadow-sm">
    <!-- Card content -->
  </div>
</div>
```

## Common Updates Needed

### 1. Update Container Classes

Replace fixed containers with responsive ones:

```css
/* Old */
.tw:max-w-7xl.tw:px-6

/* New */
.tw:w-full.tw:max-w-7xl.tw:mx-auto.tw:px-4.sm:tw:px-6.lg:tw:px-8
```

### 2. Update Text Sizes

Use responsive text utilities:

```css
/* Old */
.tw:text-3xl

/* New */
.tw:text-2xl.sm:tw:text-3xl
```

### 3. Update Button Layouts

Make buttons full-width on mobile:

```vue
<!-- Old -->
<div class="tw:flex tw:gap-3 tw:justify-end">
  <button class="tw-px-6 tw:py-2">Cancel</button>
  <button class="tw-px-6 tw:py-2">Submit</button>
</div>

<!-- New -->
<div class="tw-flex tw:flex-col sm:tw:flex-row tw-gap-3 tw:justify-end">
  <button class="tw:w-full sm:tw:w-auto tw-px-6 tw:py-3">Cancel</button>
  <button class="tw:w-full sm:tw:w-auto tw-px-6 tw:py-3">Submit</button>
</div>
```

### 4. Update Form Layouts

Use responsive form grids:

```vue
<!-- Old -->
<div class="tw:grid tw:grid-cols-2 tw:gap-4">
  <!-- Form fields -->
</div>

<!-- New -->
<div class="tw-grid tw:grid-cols-1 md:tw:grid-cols-2 tw:gap-4">
  <!-- Form fields -->
</div>
```

## Migration Checklist

For each profile page:

- [ ] Import ResponsiveProfileLayout and ResponsiveTabs
- [ ] Wrap content in ResponsiveProfileLayout
- [ ] Move sidebar to #sidebar slot
- [ ] Move main content to #content slot
- [ ] Replace regular tabs with ResponsiveTabs
- [ ] Update container classes for responsive padding
- [ ] Update text sizes with responsive utilities
- [ ] Make buttons full-width on mobile
- [ ] Update form grids to be responsive
- [ ] Test on mobile, tablet, and desktop

## Pages to Update

1. **Event Pages**
   - EventSettings.vue
   - EventPremiumSettings.vue
   - CreateEventFree.vue
   - CreateEventPremium.vue

2. **Organizer Pages**
   - EventOrganiserSettings.vue
   - EventOrganiserPremiumSettings.vue
   - CreateEventOrganiserFree.vue
   - CreateEventOrganiserPremium.vue

3. **Talent Pages**
   - TalentsSettings.vue
   - TalentsPremiumSettings.vue
   - CreateTalentsFree.vue
   - CreateTalentsPremium.vue

4. **Venue Pages**
   - VenueSettings.vue
   - VenuePremiumSettings.vue
   - CreateVenueFree.vue
   - CreateVenuePremium.vue

## Testing After Migration

After each page migration:

1. **Mobile Test (< 640px)**
   - Check hamburger menu works
   - Verify sidebar slides in/out
   - Ensure tabs become accordions
   - Check no horizontal scroll
   - Test touch targets

2. **Tablet Test (640px - 1024px)**
   - Verify 2-column layouts
   - Check navigation accessibility
   - Test form layouts

3. **Desktop Test (> 1024px)**
   - Verify sidebar is visible
   - Check hover states
   - Test multi-column layouts

## Getting Help

If you encounter issues during migration:

1. Check the responsive documentation: `/src/docs/RESPONSIVE_DESIGN.md`
2. Review the example implementation: `EventOrganiserPremiumSettingsResponsive.vue`
3. Test with Chrome DevTools device mode
4. Ensure all CSS imports are included in `main.ts`

## Best Practices

1. **Mobile First**: Always design for mobile first, then enhance for larger screens
2. **Touch Targets**: Ensure all interactive elements are at least 44px
3. **Spacing**: Use responsive spacing utilities for consistent gaps
4. **Images**: Always use responsive image techniques
5. **Performance**: Lazy load components and optimize for mobile

## Advanced Customizations

For custom responsive behavior:

1. Create custom CSS classes in `responsive.css`
2. Use CSS custom properties for theming
3. Implement progressive enhancement patterns
4. Consider device-specific features (e.g., touch vs mouse)
