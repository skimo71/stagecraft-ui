import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AppLayout } from './layouts/AppLayout'
import { DashboardPage } from './pages/DashboardPage'
import { ArtistListPage } from './pages/artists/ArtistListPage'
import { ArtistDetailPage } from './pages/artists/ArtistDetailPage'
import { VenueListPage } from './pages/venues/VenueListPage'
import { VenueDetailPage } from './pages/venues/VenueDetailPage'
import { OfferListPage } from './pages/offers/OfferListPage'
import { OfferDetailPage } from './pages/offers/OfferDetailPage'
import { ShowListPage } from './pages/shows/ShowListPage'
import { ShowDetailPage } from './pages/shows/ShowDetailPage'
import { NotFoundPage } from './pages/NotFoundPage'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="artists" element={<ArtistListPage />} />
            <Route path="artists/:id" element={<ArtistDetailPage />} />
            <Route path="venues" element={<VenueListPage />} />
            <Route path="venues/:id" element={<VenueDetailPage />} />
            <Route path="offers" element={<OfferListPage />} />
            <Route path="offers/:id" element={<OfferDetailPage />} />
            <Route path="shows" element={<ShowListPage />} />
            <Route path="shows/:id" element={<ShowDetailPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
