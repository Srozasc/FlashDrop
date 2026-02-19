import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { View, Text } from 'react-native';
import { Grid, List, User, Home, MapPin } from 'lucide-react-native';
import { Colors } from '../../constants/Colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from '../context/AuthContext';
import LoginScreen from '../screens/LoginScreen';
import { CartProvider } from '../context/CartContext';
import DriverNavigator from './DriverNavigator';

import OrdersScreen from '../screens/OrdersScreen';
import OrderDetailScreen from '../screens/OrderDetailScreen';
import MapScreen from '../screens/MapScreen';
import HomeScreen from '../screens/HomeScreen';
import ProductsScreen from '../screens/ProductsScreen';
import AddressesScreen from '../screens/AddressesScreen';
import ProfileScreen from '../screens/ProfileScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import { ShoppingCart } from 'lucide-react-native';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MainTabs() {
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
        name="Catalog"
        component={HomeScreen}
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
              <Home color={focused ? '#000' : '#BDBDBD'} size={24} />
              {focused && <Text style={{ fontWeight: 'bold', color: '#000' }}>Inicio</Text>}
            </View>
          ),
          tabBarLabel: 'Inicio',
        }}
      />
      <Tab.Screen
        name="Orders"
        component={OrdersScreen}
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
              <List color={focused ? '#000' : '#BDBDBD'} size={24} />
              {focused && <Text style={{ fontWeight: 'bold', color: '#000' }}>Mis pedidos</Text>}
            </View>
          ),
          tabBarLabel: 'Mis pedidos',
        }}
      />
      <Tab.Screen
        name="Addresses"
        component={AddressesScreen}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <View style={{ padding: 10 }}>
              <User color={focused ? '#000' : '#BDBDBD'} size={24} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Checkout"
        component={CheckoutScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={{ padding: 10 }}>
              <ShoppingCart color={focused ? '#000' : '#BDBDBD'} size={24} />
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

export default function RootNavigator() {
  function AppInner() {
    const { token, user, loading } = useAuth();
    if (loading) return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text>Cargando...</Text></View>;
    return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {token ? (
            user?.role === 'repartidor' ? (
              <Stack.Screen name="DriverApp" component={DriverNavigator} />
            ) : (
              <>
                <Stack.Screen name="MainTabs" component={MainTabs} />
                <Stack.Screen name="OrderDetail" component={OrderDetailScreen} />
                <Stack.Screen name="Map" component={MapScreen} />
              </>
            )
          ) : (
            <Stack.Screen name="Login" component={LoginScreen} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
  return (
    <AuthProvider>
      <CartProvider>
        <AppInner />
      </CartProvider>
    </AuthProvider>
  );
}
