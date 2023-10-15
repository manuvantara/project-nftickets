import { EventMetadata, TicketMetadata } from '../types';

export function isTicket(obj: any): obj is TicketMetadata {
  return (
    obj && // Check if object is not null or undefined
    typeof obj === 'object' && // Check if it's an object
    typeof obj.name === 'string' && // Check for string properties
    typeof obj.description === 'string' &&
    typeof obj.image === 'string' &&
    typeof obj.animation_url === 'string' &&
    typeof obj.external_url === 'string' &&
    Array.isArray(obj.attributes) && // Check if attributes is an array
    obj.attributes.length === 4 && // Check if there are at least 4 attributes
    obj.attributes.every(
      // Check if every attribute has a trait_type and value
      (attr: any) =>
        typeof attr === 'object' &&
        typeof attr.trait_type === 'string' &&
        typeof attr.value === 'string',
    ) &&
    typeof obj.properties === 'object' && // Check properties structure
    Array.isArray(obj.properties.files) &&
    typeof obj.properties.category === 'string'
  );
}

export function isEvent(obj: any): obj is EventMetadata {
  return (
    obj && // Check if object is not null or undefined
    typeof obj === 'object' && // Check if it's an object
    typeof obj.name === 'string' && // Check for string properties
    typeof obj.description === 'string' &&
    typeof obj.image === 'string' &&
    typeof obj.animation_url === 'string' &&
    typeof obj.external_url === 'string' &&
    Array.isArray(obj.attributes) && // Check if attributes is an array
    obj.attributes.length === 2 && // Specific for EventMetadata, expecting exactly 2 attributes
    obj.attributes.every(
      // Check each attribute for the correct structure
      (attr: any) =>
        typeof attr === 'object' &&
        typeof attr.trait_type === 'string' &&
        typeof attr.value === 'string',
    ) &&
    obj.attributes[0].trait_type === 'start_time' && // Specific trait_type checks
    obj.attributes[1].trait_type === 'candy_machine' &&
    typeof obj.properties === 'object' && // Check properties structure
    Array.isArray(obj.properties.files) &&
    obj.properties.files.length === 1 && // Should have exactly one file
    typeof obj.properties.category === 'string' && // Check for string property
    obj.properties.category === 'banner' && // Specific value for category
    obj.properties.files[0].type === 'image/jpg' && // Specific checks for file type and CDN flag
    obj.properties.files[0].cdn === false
  );
}
