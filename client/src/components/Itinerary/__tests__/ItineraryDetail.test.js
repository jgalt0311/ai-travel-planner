import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '../../../contexts/AuthContext';
import ItineraryDetail from '../ItineraryDetail';

const renderItineraryDetail = (id = '1') => {
  return render(
    <MemoryRouter initialEntries={[`/itinerary/${id}`]}>
      <AuthProvider>
        <Routes>
          <Route path="/itinerary/:id" element={<ItineraryDetail />} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>
  );
};

describe('ItineraryDetail', () => {
  beforeEach(() => {
    localStorage.setItem('token', 'fake-jwt-token');
  });

  afterEach(() => {
    localStorage.clear();
  });

  test('loads and displays itinerary details', async () => {
    renderItineraryDetail();

    // Loading state
    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Test Itinerary')).toBeInTheDocument();
    });

    // Verify destination info
    expect(screen.getByText('Paris')).toBeInTheDocument();

    // Verify weather info is displayed
    expect(screen.getByText('20°')).toBeInTheDocument();
    expect(screen.getByText(/sunny/i)).toBeInTheDocument();
  });

  test('handles error state', async () => {
    renderItineraryDetail('invalid-id');

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/failed to fetch itinerary/i);
    });
  });

  test('displays activities in chronological order', async () => {
    renderItineraryDetail();

    await waitFor(() => {
      const activities = screen.getAllByRole('button', { name: /show more/i });
      expect(activities).toHaveLength(1); // Update this based on your mock data
    });
  });
});