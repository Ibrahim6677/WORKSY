import { useState } from "react";
import { Switch } from "@headlessui/react";
import SettingHeader from "../../components/organisms/WorkspaceHeaders/SettingHeader";
import { BottomLink } from "../../components/atoms/Bottom/BottomLink";

export default function NotificationSettings() {
  const [settings, setSettings] = useState({
    directMessage: true,
    mentions: true,
    allChannelMessages: true,
    dailySummary: false,
    weeklyDigest: true,
  });

  const toggleSetting = (key: keyof NotificationSettingsState) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  interface NotificationSettingsState {
    directMessage: boolean;
    mentions: boolean;
    allChannelMessages: boolean;
    dailySummary: boolean;
    weeklyDigest: boolean;
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(settings);
  };

  return (
    <>
      <SettingHeader />
      <div className="max-w-full mx-auto p-6 bg-white rounded-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Message Notifications */}
          <div className="text-inter">
            <h2 className="text-md font-bold text-inter mb-4 text-[#141414]">
              Message Notification
            </h2>

            {/* Direct Message */}
            <div className="flex-col justify-between items-center">
              <div>
                <p className="text-[#353B45] text-sm font-normal py-2">
                  Direct Message
                </p>
                <hr className="text-[#D9D9D9]" />
              </div>
              <div className="flex justify-between items-center py-2  ">
                <p className="text-[#667185] text-sm capitalize">
                  get notified when someone sends you a direct message
                </p>
                <Switch
                  checked={settings.directMessage}
                  onChange={() => toggleSetting("directMessage")}
                  className={`${
                    settings.directMessage ? "bg-[#6629DE]" : "bg-gray-300"
                  } relative inline-flex h-6 w-11 items-center rounded-full`}
                >
                  <span
                    className={`${
                      settings.directMessage ? "translate-x-6" : "translate-x-1"
                    } inline-block h-4 w-4 transform bg-white rounded-full transition`}
                  />
                </Switch>
              </div>
            </div>

            {/* Mentions */}
            <div className="flex-col justify-between items-center">
              <div>
                <p className="text-[#353B45] text-sm font-normal py-2">
                  Mentions
                </p>
                <hr className="text-[#D9D9D9]" />
              </div>
              <div className="flex justify-between items-center">
                <p className="text-[#667185] text-sm capitalize py-2">
                  get notified when someone mention you in a channel
                </p>
                <Switch
                  checked={settings.mentions}
                  onChange={() => toggleSetting("mentions")}
                  className={`${
                    settings.mentions ? "bg-[#6629DE]" : "bg-gray-300"
                  } relative inline-flex h-6 w-11 items-center rounded-full`}
                >
                  <span
                    className={`${
                      settings.mentions ? "translate-x-6" : "translate-x-1"
                    } inline-block h-4 w-4 transform bg-white rounded-full transition`}
                  />
                </Switch>
              </div>
            </div>

            {/* All Channel Messages */}
            <div className="flex-col justify-between items-center">
              <div>
                <p className="text-[#353B45] text-sm font-normal py-2">
                  All Channel Messages
                </p>
                <hr className="text-[#D9D9D9]" />
              </div>
              <div className="flex justify-between items-center py-2">
                <p className="text-[#667185] text-sm capitalize">
                  get notified for every message in channel you are in
                </p>
                <Switch
                  checked={settings.allChannelMessages}
                  onChange={() => toggleSetting("allChannelMessages")}
                  className={`${
                    settings.allChannelMessages ? "bg-[#6629DE]" : "bg-gray-300"
                  } relative inline-flex h-6 w-11 items-center rounded-full`}
                >
                  <span
                    className={`${
                      settings.allChannelMessages ? "translate-x-6" : "translate-x-1"
                    } inline-block h-4 w-4 transform bg-white rounded-full transition`}
                  />
                </Switch>
              </div>
            </div>
          </div>

          {/* Email Notifications */}
          <div>
            <h2 className="text-md font-semibold mb-4">Message Notification</h2>

            {/* Daily Summary */}
            
            <div className="flex-col justify-between items-center">
              <div>
                <p className="text-[#353B45] text-sm font-normal capitalize py-2">
                  daily summary
                </p>
                <hr className="text-[#D9D9D9]" />
              </div>
              <div className="flex justify-between items-center py-2">
                <p className="text-[#667185] text-sm capitalize">
                  get a daily email with important updates
                </p>
                <Switch
                  checked={settings.dailySummary}
                  onChange={() => toggleSetting("dailySummary")}
                  className={`${
                    settings.dailySummary ? "bg-[#6629DE]" : "bg-gray-300"
                  } relative inline-flex h-6 w-11 items-center rounded-full`}
                >
                  <span
                    className={`${
                      settings.dailySummary ? "translate-x-6" : "translate-x-1"
                    } inline-block h-4 w-4 transform bg-white rounded-full transition`}
                  />
                </Switch>
              </div>
            </div>

            {/* Weekly Digest */}
          <div className="flex-col justify-between items-center">
              <div>
                <p className="text-[#353B45] text-sm font-normal py-2">
                  Weekly Digest
                </p>
                <hr className="text-[#D9D9D9]" />
              </div>
              <div className="flex justify-between items-center py-2">
                <p className="text-[#667185] text-sm">
                  get a weekly summary of workspace activity
                </p>
                <Switch
                  checked={settings.weeklyDigest}
                  onChange={() => toggleSetting("weeklyDigest")}
                  className={`${
                    settings.weeklyDigest ? "bg-[#6629DE]" : "bg-gray-300"
                  } relative inline-flex h-6 w-11 items-center rounded-full`}
                >
                  <span
                    className={`${
                      settings.weeklyDigest ? "translate-x-6" : "translate-x-1"
                    } inline-block h-4 w-4 transform bg-white rounded-full transition`}
                  />
                </Switch>
              </div>
            </div>
          </div>

          {/* Save Changes */}
          <div>
            <BottomLink type="submit" to="#">
              Save Change
            </BottomLink>
          </div>
        </form>
      </div>
    </>
  );
}
