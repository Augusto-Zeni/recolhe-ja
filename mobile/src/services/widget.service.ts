import { setWidgetData } from 'expo-widget';
//import { atualizarWidget } from './api'; // Your backend function

interface WidgetData {
  title: string;
  description: string;
  date: string;
}

// This function runs when the widget needs to update
export async function widgetTask() {
  try {
    // Call your backend function
    //const data: WidgetData = await atualizarWidget();
    
    // Update the widget with the new data
    await setWidgetData({
      title: "eita",
      description: "aaaaa",
      date: "01/01/2025",
    });
  } catch (error) {
    console.error('Error updating widget:', error);
    
    // Fallback data in case of error
    await setWidgetData({
      title: 'Error',
      description: 'Failed to load data',
      date: new Date().toLocaleDateString(),
    });
  }
}