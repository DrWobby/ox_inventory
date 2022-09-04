import { Box } from '@mui/material';
import InventoryComponent from './components/inventory';
import useNuiEvent from './hooks/useNuiEvent';
import { Items } from './store/items';
import { Locale } from './store/locale';
import { setShiftPressed, setupInventory } from './store/inventory';
import { Inventory } from './typings';
import { useAppDispatch } from './store';
import { debugData } from './utils/debugData';
import DragPreview from './components/utils/DragPreview';
import Notifications from './components/utils/Notifications';
import { fetchNui } from './utils/fetchNui';
import useKeyPress from './hooks/useKeyPress';
import { useEffect } from 'react';
import { useDragDropManager } from 'react-dnd';

debugData([
  {
    action: 'setupInventory',
    data: {
      leftInventory: {
        id: 'test',
        type: 'player',
        slots: 10,
        name: 'Bob Smith',
        weight: 3000,
        maxWeight: 5000,
        items: [
          {
            slot: 1,
            name: 'water',
            weight: 3000,
            metadata: {
              durability: 100,
              description: `# Testing something  \n**Yes**`,
              serial: 'SUPERCOOLWATER9725',
              mustard: '60%',
              ketchup: '30%',
              mayo: '10%',
            },
            count: 5,
          },
          { slot: 2, name: 'money', weight: 0, count: 32000 },
          { slot: 3, name: 'cola', weight: 100, count: 1, metadata: { type: 'Special' } },
          {
            slot: 4,
            name: 'water',
            weight: 100,
            count: 1,
            metadata: { description: 'Generic item description' },
          },
          { slot: 5, name: 'water', weight: 100, count: 1 },
        ],
      },
      rightInventory: {
        id: 'shop',
        type: 'shop',
        slots: 10,
        name: 'Bob Smith',
        weight: 3000,
        maxWeight: 5000,
        items: [{ slot: 1, name: 'water', weight: 500, price: 300 }],
      },
    },
  },
]);

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const manager = useDragDropManager();
  const shiftPressed = useKeyPress('Shift');

  useNuiEvent<{
    locale: { [key: string]: string };
    items: typeof Items;
    leftInventory: Inventory;
  }>('init', ({ locale, items, leftInventory }) => {
    for (const [name, data] of Object.entries(locale)) Locale[name] = data;

    for (const [name, data] of Object.entries(items)) Items[name] = data;

    dispatch(setupInventory({ leftInventory }));
  });

  useEffect(() => {
    dispatch(setShiftPressed(shiftPressed));
  }, [shiftPressed, dispatch]);

  fetchNui('uiLoaded', {});

  useNuiEvent('closeInventory', () => {
    manager.dispatch({ type: 'dnd-core/END_DRAG' });
  });

  return (
    <Box sx={{ height: '100%', width: '100%', color: 'white' }}>
      <InventoryComponent />
      <Notifications />
      <DragPreview />
    </Box>
  );
};

export default App;