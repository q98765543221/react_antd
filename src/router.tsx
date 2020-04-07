import React, { useState, useEffect,  Suspense, lazy} from 'react';

const  ConfigLocal = lazy(() => import('./pages/local'));
const ConfigSystemSetting = lazy(() => import('./pages/system/setting'));
const ConfigSystemMaintain = lazy(() => import('./pages/system/maintain'));

export {
  ConfigLocal,
  ConfigSystemSetting,
  ConfigSystemMaintain
}


