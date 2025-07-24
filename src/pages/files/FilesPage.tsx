import { Suspense } from 'react';
import MainFiles from '../../components/organisms/File/MainFiles';

export default function FilesPage() {
  return (
    <div className="h-full">
      <Suspense fallback={
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6629DE]"></div>
        </div>
      }>
        <MainFiles />
      </Suspense>
    </div>
  );
}
