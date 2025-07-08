import React, { Suspense, lazy } from "react";
import LoadingPage from "../loadingPage";
// Replace all direct component imports with lazy imports and wrap main render in <Suspense fallback={<LoadingPage />}> ... </Suspense> 