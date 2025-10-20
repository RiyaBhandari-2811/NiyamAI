export default function Home() {
  const handleConnect = () => {
    const clientId = "auzfos4mGzu0ryPQzwW0hQw1SBJuAH2M";
    const redirectUri = "https://riyabhandari.netlify.app/api/auth/callback";
    const state = crypto.randomUUID();

    const jiraAuthUrl = `https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=${clientId}&scope=read%3Ajira-work%20manage%3Ajira-project%20manage%3Ajira-configuration%20read%3Ajira-user%20write%3Ajira-work&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&state=${state}&response_type=code&prompt=consent`;

    window.location.href = jiraAuthUrl;
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <button className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
      onClick={handleConnect}
      >
        Connect to JIRA
      </button>
    </div>
  );
}
