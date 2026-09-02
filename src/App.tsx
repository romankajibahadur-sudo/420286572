import { Suspense, lazy, type ComponentType } from 'react';
import { HashRouter, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, MotionConfig, motion } from 'framer-motion';
import { MountainSnow } from 'lucide-react';
import { Layout } from './components/Layout';
import { ToastProvider, pageVariants } from './components/ui';
import { AuthProvider } from './lib/auth';
import { JourneysProvider } from './data/store';

/* Code-split pages (home stays inline for the fastest first paint) */
import Home from './pages/Home';
const TreksPage = lazy(() => import('./pages/TreksPage'));
const TrekDetail = lazy(() => import('./pages/TrekDetail'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const GalleryPage = lazy(() => import('./pages/GalleryPage'));
const Booking = lazy(() => import('./pages/Booking'));
const Login = lazy(() => import('./pages/Login'));
const AdminApp = lazy(() => import('./pages/admin/AdminApp'));
const NotFound = lazy(() => import('./pages/NotFound'));

const DestinationsPage = lazy(async () => ({ default: (await import('./pages/DestinationPages')).DestinationsPage }));
const DestinationDetail = lazy(async () => ({ default: (await import('./pages/DestinationPages')).DestinationDetail }));
const ActivitiesPage = lazy(async () => ({ default: (await import('./pages/ExplorePages')).ActivitiesPage }));
const RegionsPage = lazy(async () => ({ default: (await import('./pages/ExplorePages')).RegionsPage }));
const TravelInfoPage = lazy(async () => ({ default: (await import('./pages/TravelInfo')).TravelInfoPage }));
const ArticlePage = lazy(async () => ({ default: (await import('./pages/TravelInfo')).ArticlePage }));

function Loader() {
  return (
    <div className="grid min-h-svh place-items-center bg-sand-50" role="status" aria-label="Loading">
      <div className="flex flex-col items-center gap-4">
        <span className="grid size-16 animate-pulse-soft place-items-center rounded-2xl bg-night-950 text-ember-400 shadow-lift">
          <MountainSnow className="size-8" aria-hidden />
        </span>
        <span className="text-[11px] font-extrabold uppercase tracking-[0.3em] text-night-900/40">Loading the trail…</span>
      </div>
    </div>
  );
}

function Page({ children: C }: { children: ComponentType }) {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <C />
    </motion.div>
  );
}

/** Public marketing site — wrapped in the navbar/footer shell. */
function PublicRoutes() {
  const location = useLocation();
  return (
    <Layout>
      <Suspense fallback={<Loader />}>
        <AnimatePresence mode="wait" initial={false}>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Page>{Home}</Page>} />
            <Route path="/treks" element={<Page>{TreksPage}</Page>} />
            <Route path="/treks/:slug" element={<Page>{TrekDetail}</Page>} />
            <Route path="/destinations" element={<Page>{DestinationsPage}</Page>} />
            <Route path="/destinations/:slug" element={<Page>{DestinationDetail}</Page>} />
            <Route path="/activities" element={<Page>{ActivitiesPage}</Page>} />
            <Route path="/regions" element={<Page>{RegionsPage}</Page>} />
            <Route path="/gallery" element={<Page>{GalleryPage}</Page>} />
            <Route path="/booking" element={<Page>{Booking}</Page>} />
            <Route path="/about" element={<Page>{About}</Page>} />
            <Route path="/contact" element={<Page>{Contact}</Page>} />
            <Route path="/travel-info" element={<Page>{TravelInfoPage}</Page>} />
            <Route path="/travel-info/:slug" element={<Page>{ArticlePage}</Page>} />
            <Route path="*" element={<Page>{NotFound}</Page>} />
          </Routes>
        </AnimatePresence>
      </Suspense>
    </Layout>
  );
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <ToastProvider>
        <AuthProvider>
          <JourneysProvider>
            <HashRouter>
              <Routes>
                {/* Staff area renders standalone — no public navbar/footer,
                    so the dashboard sidebar owns the full viewport. */}
                <Route path="/login" element={<Suspense fallback={<Loader />}><Login /></Suspense>} />
                <Route path="/admin" element={<Suspense fallback={<Loader />}><AdminApp /></Suspense>} />
                <Route path="*" element={<PublicRoutes />} />
              </Routes>
            </HashRouter>
          </JourneysProvider>
        </AuthProvider>
      </ToastProvider>
    </MotionConfig>
  );
}
