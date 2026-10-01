import useProfileStore from "@/stores/useProfileStore";
import AvatarImage from "./AvatarImage";

// Avatar + name + @handle. Shared by the desktop dropdown and the mobile menu.
const UserSummary = ({ inDropdown = false, className = "" }) => {
  const { user } = useProfileStore();

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <AvatarImage inDropdown={inDropdown} />
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-gray-100">
          {user?.firstName} {user?.lastName}
        </p>
        {user?.username && (
          <p className="truncate text-xs text-gray-400" title={`@${user.username}`}>
            @{user.username}
          </p>
        )}
      </div>
    </div>
  );
};

export default UserSummary;
