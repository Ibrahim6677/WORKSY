const FilesHeader = () => {
  return (
    <div className="flex items-center justify-between px-12 py-6 bg-[#FBFBFB] border-b border-[#EFEFFD]">
      <h3 className="text-[#000] text-inter text-lg font-bold">Files</h3>
      <button className="capitalize border text-sm px-2 py-1 bg-[#FAFAFA]">
        upload files
      </button>
    </div>
  );
};

export default FilesHeader;
