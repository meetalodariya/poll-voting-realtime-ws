import React, { lazy, Suspense } from 'react';
import { ThemeProvider } from '@mui/material';
import { Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';

import { AppProvider } from './providers/app';
import theme from './theme';
const Dashboard = lazy(() => import('./apps/Dashboard'));
const PollDetails = lazy(() => import('./apps/PollDetails'));

const queryClient = new QueryClient();

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <AppProvider>
          <Routes>
            <Route
              path='/'
              element={
                <Suspense fallback={<>Loading...</>}>
                  <Dashboard />
                </Suspense>
              }
            />
            <Route
              path='/poll/:pollId'
              element={
                <Suspense fallback={<>Loading...</>}>
                  <PollDetails />
                </Suspense>
              }
            />
          </Routes>
        </AppProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
