import React, { useState, useEffect } from 'react';
import { DigitalCorkboardKiosk, type BoardDisplayConfig } from './components/kiosk/DigitalCorkboardKiosk';
import { CorkboardPreviewModal } from './components/CorkboardPreviewModal';
import { SuperAdminDashboard } from './components/admin/SuperAdminDashboard';
import { StoreDashboard } from './components/store/StoreDashboard';
import { StoreAuthScreen } from './components/store/StoreAuthScreen';
import { ManageScreenListPage } from './components/listing/ManageScreenListPage';
import { INITIAL_STORES, INITIAL_BOARDS, type StorePartner } from './data/boardsData';
import { SAMPLE_CORKBOARD_LISTINGS, type ListingCardItem } from './data/findingsData';

type ActiveView = 'admin' | 'kiosk' | 'store-dashboard' | 'store-auth' | 'manage-list';

export default function App() {
  const [activeStore, setActiveStore] = useState<StorePartner>(INITIAL_STORES[0]);
  const [isSuperAdminPreview, setIsSuperAdminPreview] = useState<boolean>(false);
  const [activeBoardIdForManage, setActiveBoardIdForManage] = useState<string>('SM-LV-001');
  const [listings, setListings] = useState<ListingCardItem[]>(SAMPLE_CORKBOARD_LISTINGS);

  const [activeView, setActiveView] = useState<ActiveView>(() => {
    if (typeof window !== 'undefined') {
      try {
        const params = new URLSearchParams(window.location.search);
        if (params.get('manage') || params.get('register') || params.get('view') === 'manage') {
          return 'manage-list';
        }
        if (params.get('view') === 'store' || params.has('store')) {
          return 'store-dashboard';
        }
        if (params.get('view') === 'store-auth' || params.get('auth') === 'store') {
          return 'store-auth';
        }
        if (
          params.get('pin') ||
          params.get('view') === 'kiosk' ||
          params.has('kiosk')
        ) {
          return 'kiosk';
        }
      } catch {
        // Fallback to admin
      }
    }
    return 'admin';
  });

  const [isCorkboardModalOpen, setIsCorkboardModalOpen] = useState(false);
  const [activeBoardConfig, setActiveBoardConfig] = useState<BoardDisplayConfig | undefined>(undefined);
  const [activeSlideInterval, setActiveSlideInterval] = useState<number>(10);

  // Switch views if URL parameters change or user navigates via deep links
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleUrlChange = () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const hasHashParams =
          window.location.hash.includes('pin=') ||
          window.location.hash.includes('manage=') ||
          window.location.hash.includes('register=') ||
          window.location.hash.includes('kiosk');

        const manageParam = params.get('manage') || params.get('register');
        if (manageParam || params.get('view') === 'manage') {
          if (manageParam) setActiveBoardIdForManage(manageParam);
          setActiveView('manage-list');
        } else if (params.get('view') === 'store' || params.has('store')) {
          setActiveView('store-dashboard');
        } else if (params.get('view') === 'store-auth' || params.get('auth') === 'store') {
          setActiveView('store-auth');
        } else if (
          params.get('pin') ||
          params.get('view') === 'kiosk' ||
          params.has('kiosk') ||
          hasHashParams
        ) {
          setActiveView('kiosk');
        }
      } catch {
        // Fallback
      }
    };
    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

  const handleLaunchFullscreenBoard = (boardConfig?: BoardDisplayConfig, slideInterval?: number) => {
    setActiveBoardConfig(boardConfig);
    if (slideInterval) setActiveSlideInterval(slideInterval);
    setActiveView('kiosk');
  };

  const handleOpenPreviewModal = (boardConfig?: BoardDisplayConfig, slideInterval?: number) => {
    setActiveBoardConfig(boardConfig);
    if (slideInterval) setActiveSlideInterval(slideInterval);
    setIsCorkboardModalOpen(true);
  };

  const handlePreviewStoreDashboard = (store: StorePartner) => {
    setActiveStore(store);
    setIsSuperAdminPreview(true);
    setActiveView('store-dashboard');
  };

  const handleStoreLoginSuccess = (store: StorePartner) => {
    setActiveStore(store);
    setIsSuperAdminPreview(false);
    setActiveView('store-dashboard');
  };

  const handleExitToSuperAdmin = () => {
    setIsSuperAdminPreview(false);
    setActiveView('admin');
  };

  const handleStoreSignOut = () => {
    setIsSuperAdminPreview(false);
    setActiveView('store-auth');
  };

  const handleOpenManageList = (boardId: string) => {
    setActiveBoardIdForManage(boardId);
    setActiveView('manage-list');
  };

  const handleListingActivated = (newListing: ListingCardItem) => {
    setListings((prev) => [newListing, ...prev]);
  };

  // 1. Dedicated Manage Screen Listings Page (User List, Quick Listing Form, Checkout & 1-sec SuperAdmin Activation)
  if (activeView === 'manage-list') {
    return (
      <>
        <ManageScreenListPage
          boardId={activeBoardIdForManage}
          onBackToKiosk={() => setActiveView('kiosk')}
          onBackToAdmin={() => setActiveView('admin')}
          onListingActivated={handleListingActivated}
          onViewLiveBoard={() => {
            const matchedBoard = INITIAL_BOARDS.find(
              (b) => b.id.toLowerCase() === activeBoardIdForManage.toLowerCase()
            ) || INITIAL_BOARDS[0];
            handleLaunchFullscreenBoard(
              {
                storeName: matchedBoard.storeName,
                storeAddress: matchedBoard.storeAddress,
                boardId: matchedBoard.id,
                status: matchedBoard.status,
                screenType: matchedBoard.screenDiagonal,
              },
              matchedBoard.slideIntervalSec
            );
          }}
          allListings={listings}
        />

        <CorkboardPreviewModal
          isOpen={isCorkboardModalOpen}
          onClose={() => setIsCorkboardModalOpen(false)}
          boardConfig={activeBoardConfig}
          initialSlideInterval={activeSlideInterval}
          onOpenStoreDashboard={() => {
            setIsCorkboardModalOpen(false);
            setActiveView('store-dashboard');
          }}
          onOpenManageList={handleOpenManageList}
          allListings={listings}
        />
      </>
    );
  }

  // 2. Dedicated full-screen kiosk view
  if (activeView === 'kiosk') {
    return (
      <DigitalCorkboardKiosk
        onExitFullscreen={() => setActiveView(isSuperAdminPreview ? 'admin' : 'admin')}
        isEmbedded={false}
        boardConfig={activeBoardConfig}
        initialSlideInterval={activeSlideInterval}
        onOpenStoreDashboard={() => setActiveView('store-dashboard')}
        onOpenManageList={handleOpenManageList}
        allListings={listings}
      />
    );
  }

  // 3. Store Owner / Merchant Authentication Screen
  if (activeView === 'store-auth') {
    return (
      <StoreAuthScreen
        onLoginSuccess={handleStoreLoginSuccess}
        onExitToKiosk={() => setActiveView('kiosk')}
        onExitToSuperAdmin={() => setActiveView('admin')}
        initialStoreId={activeStore.id}
      />
    );
  }

  // 4. Store Merchant Dashboard View (Mobile-First with Hamburger Sidebar)
  if (activeView === 'store-dashboard') {
    return (
      <>
        <StoreDashboard
          store={activeStore}
          isSuperAdminPreview={isSuperAdminPreview}
          onExitToSuperAdmin={handleExitToSuperAdmin}
          onSignOut={handleStoreSignOut}
          onLaunchStoreBoard={(config, interval) => handleLaunchFullscreenBoard(config, interval)}
          onOpenCorkboardPreview={(config, interval) => handleOpenPreviewModal(config, interval)}
        />

        <CorkboardPreviewModal
          isOpen={isCorkboardModalOpen}
          onClose={() => setIsCorkboardModalOpen(false)}
          boardConfig={activeBoardConfig}
          initialSlideInterval={activeSlideInterval}
          onOpenStoreDashboard={() => {
            setIsCorkboardModalOpen(false);
            setActiveView('store-dashboard');
          }}
          onOpenManageList={handleOpenManageList}
          allListings={listings}
        />
      </>
    );
  }

  // 5. Super Admin Fleet Command Center & Analytics Dashboard
  return (
    <>
      <SuperAdminDashboard
        onLaunchBoard={(config, interval) => handleLaunchFullscreenBoard(config, interval)}
        onOpenPreviewModal={(config, interval) => handleOpenPreviewModal(config, interval)}
        onPreviewStoreDashboard={handlePreviewStoreDashboard}
        onNavigateToStoreAuth={() => setActiveView('store-auth')}
        onOpenManageList={handleOpenManageList}
        sharedPins={listings}
      />

      <CorkboardPreviewModal
        isOpen={isCorkboardModalOpen}
        onClose={() => setIsCorkboardModalOpen(false)}
        boardConfig={activeBoardConfig}
        initialSlideInterval={activeSlideInterval}
        onOpenStoreDashboard={() => {
          setIsCorkboardModalOpen(false);
          setActiveView('store-dashboard');
        }}
        onOpenManageList={handleOpenManageList}
        allListings={listings}
      />
    </>
  );
}
