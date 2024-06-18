const NoCampaign = () => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-y-6">
      <img src="/images/pools-no-data.webp" alt="loading" width={108} height={99} />
      <div className="font-micro text-4xl text-bc-white">NO CAMPAIGN ON THIS CHAIN YET</div>
    </div>
  );
};
export default NoCampaign;
