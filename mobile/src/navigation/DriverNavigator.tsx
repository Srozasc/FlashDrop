import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text } from 'react-native';
import { MapPin, List, User, Truck } from 'lucide-react-native';
import { Colors } from '../../constants/Colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import DriverDashboardScreen from '../screens/driver/DashboardScreen';
import DriverOrdersScreen from '../screens/driver/OrdersScreen';
import DeliveryDetailScreen from '../screens/driver/DeliveryDetailScreen';
import ProfileScreen from '../screens/ProfileScreen'; // Reutilizamos el perfil

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function DriverTabs() {
  const insets = useSafeAreaInsets();
  
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 0,
          elevation: 10,
          height: 70,
          paddingBottom: 10 + insets.bottom,
          paddingTop: 10,
          borderRadius: 35,
          margin: 20,
          position: 'absolute',
          bottom: 8 + insets.bottom,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 5 },
          shadowOpacity: 0.1,
          shadowRadius: 5,
        },
        tabBarShowLabel: false,
        tabBarActiveTintColor: Colors.light.primary,
        tabBarInactiveTintColor: '#BDBDBD',
      }}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DriverDashboardScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={{ 
              backgroundColor: focused ? Colors.light.primary : 'transparent', 
              paddingHorizontal: 20, 
              paddingVertical: 10, 
              borderRadius: 20,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8
            }}>
              <Truck color={focused ? '#000' : '#BDBDBD'} size={24} />
              {focused && <Text style={{ fontWeight: 'bold', color: '#000' }}>Panel</Text>}
            </View>
          ),
        }} 
      />
      <Tab.Screen 
        name="DriverOrders" 
        component={DriverOrdersScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={{ padding: 10 }}>
              <List color={focused ? '#000' : '#BDBDBD'} size={24} />
            </View>
          ),
        }} 
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={{ padding: 10 }}>
              <User color={focused ? '#000' : '#BDBDBD'} size={24} />
            </View>
          ),
        }} 
      />
    </Tab.Navigator>
  );
}

export default function DriverNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DriverTabs" component={DriverTabs} />
      <Stack.Screen name="DeliveryDetail" component={DeliveryDetailScreen} />
    </Stack.Navigator>
  );
}
