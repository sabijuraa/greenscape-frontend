// Material Calculations Service
// Based on client specifications for GreenScape Pro

export interface MaterialRequirement {
  name: string;
  quantity: number;
  unit: string;
  category: string;
}

export interface CalculationResult {
  materials: MaterialRequirement[];
  labourCost: number;
  materialsCost: number;
  totalCost: number;
}

// =============================================================================
// EDGING - Per 1 linear meter
// =============================================================================
export function calculateEdging(linearMeters: number, type: 'block_paving' | 'porcelain' = 'block_paving'): MaterialRequirement[] {
  const materials: MaterialRequirement[] = [];
  
  if (type === 'block_paving') {
    materials.push({
      name: 'Block Paving Edging',
      quantity: Math.ceil(linearMeters * 10),
      unit: 'blocks',
      category: 'Edging'
    });
  } else {
    materials.push({
      name: 'Porcelain Edging',
      quantity: Math.ceil(linearMeters),
      unit: 'linear meters',
      category: 'Edging'
    });
  }
  
  materials.push({
    name: 'Grit Sand',
    quantity: Math.ceil(linearMeters * 10),
    unit: 'kg',
    category: 'Aggregates'
  });
  
  materials.push({
    name: 'MOT Type 1',
    quantity: parseFloat((linearMeters * 0.02).toFixed(2)),
    unit: 'tonnes',
    category: 'Aggregates'
  });
  
  materials.push({
    name: 'Cement',
    quantity: parseFloat((linearMeters * 0.1).toFixed(2)),
    unit: 'bags',
    category: 'Cement'
  });
  
  return materials;
}

// =============================================================================
// CLAY PAVERS - Per square meter
// =============================================================================
export function calculateClayPavers(squareMeters: number): MaterialRequirement[] {
  return [
    {
      name: 'Clay Pavers',
      quantity: Math.ceil(squareMeters),
      unit: 'm²',
      category: 'Paving'
    },
    {
      name: 'Grit Sand',
      quantity: Math.ceil(squareMeters * 100),
      unit: 'kg',
      category: 'Aggregates'
    },
    {
      name: 'MOT Type 1',
      quantity: parseFloat((squareMeters * 0.2).toFixed(2)),
      unit: 'tonnes',
      category: 'Aggregates'
    }
  ];
}

// =============================================================================
// RESIN TWO LAYER - Per square meter
// =============================================================================
export function calculateResinTwoLayer(squareMeters: number): MaterialRequirement[] {
  return [
    {
      name: 'Resin Kit (Top and Base)',
      quantity: Math.ceil(squareMeters),
      unit: 'm²',
      category: 'Resin'
    },
    {
      name: 'MOT Type 1',
      quantity: parseFloat((squareMeters * 0.2).toFixed(2)),
      unit: 'tonnes',
      category: 'Aggregates'
    }
  ];
}

// =============================================================================
// COMPOSITE FENCING - Per panel
// =============================================================================
export function calculateCompositeFencing(numberOfPanels: number): MaterialRequirement[] {
  return [
    {
      name: 'Aluminum Posts',
      quantity: numberOfPanels * 2,
      unit: 'posts',
      category: 'Fencing'
    },
    {
      name: 'Composite Fence Panels',
      quantity: numberOfPanels * 11,
      unit: 'panels',
      category: 'Fencing'
    },
    {
      name: 'Post Mix',
      quantity: numberOfPanels * 2,
      unit: 'bags',
      category: 'Cement'
    },
    {
      name: 'Composite Fence Top Panel',
      quantity: numberOfPanels,
      unit: 'panels',
      category: 'Fencing'
    }
  ];
}

// =============================================================================
// SCREEN FENCING - Per 1.8m section
// =============================================================================
export function calculateScreenFencing(sections: number, totalSquareMeters?: number): MaterialRequirement[] {
  const materials: MaterialRequirement[] = [
    {
      name: 'Fence Battens',
      quantity: sections * 5,
      unit: 'battens',
      category: 'Fencing'
    },
    {
      name: 'Floor Board Screws/Pins',
      quantity: sections * 30,
      unit: 'screws',
      category: 'Fixings'
    }
  ];
  
  // Posts calculation - either per m² or per 3.5m² sections
  if (totalSquareMeters) {
    if (totalSquareMeters <= 3.5) {
      materials.push({
        name: 'Fence Posts',
        quantity: 2,
        unit: 'posts',
        category: 'Fencing'
      });
      materials.push({
        name: 'Post Mix',
        quantity: 2,
        unit: 'bags',
        category: 'Cement'
      });
    } else {
      const postCount = Math.ceil(totalSquareMeters * 0.6);
      const mixCount = Math.ceil((totalSquareMeters / 3.5) * 2);
      materials.push({
        name: 'Fence Posts',
        quantity: postCount,
        unit: 'posts',
        category: 'Fencing'
      });
      materials.push({
        name: 'Post Mix',
        quantity: Math.max(mixCount, sections * 6),
        unit: 'bags',
        category: 'Cement'
      });
    }
  } else {
    materials.push({
      name: 'Fence Posts',
      quantity: sections * 2,
      unit: 'posts',
      category: 'Fencing'
    });
    materials.push({
      name: 'Post Mix',
      quantity: sections * 6,
      unit: 'bags',
      category: 'Cement'
    });
  }
  
  return materials;
}

// =============================================================================
// DECKING - Per square meter
// =============================================================================
export function calculateDecking(squareMeters: number): MaterialRequirement[] {
  return [
    {
      name: 'Decking Boards (3.6m)',
      quantity: Math.ceil(squareMeters * 2),
      unit: 'boards',
      category: 'Decking'
    },
    {
      name: 'Weed Membrane',
      quantity: Math.ceil(squareMeters),
      unit: 'm²',
      category: 'Membrane'
    },
    {
      name: 'Post Mix',
      quantity: parseFloat((squareMeters * 0.5).toFixed(1)),
      unit: 'bags',
      category: 'Cement'
    },
    {
      name: 'Timber Treated 5x10cm (4x2) 4.8m',
      quantity: Math.ceil(squareMeters),
      unit: 'lengths',
      category: 'Timber'
    },
    {
      name: 'Posts 100x100mm 2.4m',
      quantity: Math.ceil(squareMeters),
      unit: 'posts',
      category: 'Timber'
    }
  ];
}

// =============================================================================
// COMBINED CALCULATOR
// =============================================================================
export type ProjectType = 
  | 'edging_block' 
  | 'edging_porcelain' 
  | 'clay_pavers' 
  | 'resin_two_layer' 
  | 'composite_fencing' 
  | 'screen_fencing' 
  | 'decking';

export interface ProjectCalculation {
  type: ProjectType;
  quantity: number; // meters, m², or panels depending on type
  additionalQuantity?: number; // for screen fencing total m²
}

export function calculateProjectMaterials(project: ProjectCalculation): MaterialRequirement[] {
  switch (project.type) {
    case 'edging_block':
      return calculateEdging(project.quantity, 'block_paving');
    case 'edging_porcelain':
      return calculateEdging(project.quantity, 'porcelain');
    case 'clay_pavers':
      return calculateClayPavers(project.quantity);
    case 'resin_two_layer':
      return calculateResinTwoLayer(project.quantity);
    case 'composite_fencing':
      return calculateCompositeFencing(project.quantity);
    case 'screen_fencing':
      return calculateScreenFencing(project.quantity, project.additionalQuantity);
    case 'decking':
      return calculateDecking(project.quantity);
    default:
      return [];
  }
}

// Project type display names
export const PROJECT_TYPE_NAMES: Record<ProjectType, string> = {
  edging_block: 'Edging (Block Paving)',
  edging_porcelain: 'Edging (Porcelain)',
  clay_pavers: 'Clay Pavers',
  resin_two_layer: 'Resin Two Layer',
  composite_fencing: 'Composite Fencing',
  screen_fencing: 'Screen Fencing',
  decking: 'Decking'
};

// Project type units
export const PROJECT_TYPE_UNITS: Record<ProjectType, string> = {
  edging_block: 'linear meters',
  edging_porcelain: 'linear meters',
  clay_pavers: 'm²',
  resin_two_layer: 'm²',
  composite_fencing: 'panels',
  screen_fencing: '1.8m sections',
  decking: 'm²'
};

// Aggregate materials from multiple project types
export function aggregateMaterials(materialLists: MaterialRequirement[][]): MaterialRequirement[] {
  const aggregated: Map<string, MaterialRequirement> = new Map();
  
  for (const list of materialLists) {
    for (const material of list) {
      const key = `${material.name}-${material.unit}`;
      if (aggregated.has(key)) {
        const existing = aggregated.get(key)!;
        existing.quantity += material.quantity;
      } else {
        aggregated.set(key, { ...material });
      }
    }
  }
  
  return Array.from(aggregated.values()).sort((a, b) => 
    a.category.localeCompare(b.category) || a.name.localeCompare(b.name)
  );
}

export default {
  calculateEdging,
  calculateClayPavers,
  calculateResinTwoLayer,
  calculateCompositeFencing,
  calculateScreenFencing,
  calculateDecking,
  calculateProjectMaterials,
  aggregateMaterials,
  PROJECT_TYPE_NAMES,
  PROJECT_TYPE_UNITS
};
