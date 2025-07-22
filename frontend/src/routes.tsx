import ScanUpdatePage from '@/pages/tracking/ScanUpdatePage';
import OperatorPortalPage from '@/pages/tracking/OperatorPortalPage';

const routes = [
  {
    path: '/tracking/scan',
    element: <ScanUpdatePage />,
  },
  {
    path: '/operator/portal',
    element: <OperatorPortalPage />,
  },
];

export default routes; 