import { Flex, Menu, Text, ActionIcon } from "@mantine/core"
import React, { useMemo } from "react"
import { LuMinus, LuEllipsis, LuSend } from "lucide-react"
import { Account, RoleName, User, AccountUser } from "~/models/portal/sdk"
import useTeamModals from "~/routes/account.$accountId.settings.members/hooks/useTeamModals"

type TeamMemberActionProps = {
  account: Account
  userRole: RoleName | null
  user?: User
  teamMember: AccountUser
  status: Boolean
}

const TeamMemberAction = ({
  user,
  account,
  userRole,
  teamMember,
  status,
}: TeamMemberActionProps) => {
  const { openRemoveUserModal, openLeaveTeamModal, openResendEmailModal } = useTeamModals(
    { account },
  )

  const menuItems = useMemo(() => {
    let items = []
    const { id, email, roleName } = teamMember

    switch (userRole) {
      case RoleName.Owner:
        if (teamMember.id === user?.portalUserID) {
          // OWNER --CANNOT-- LEAVE THEIR OWN ACCOUNT
        } else {
          // OWNER --CAN--REMOVE OTHER USERS
          items.push({
            icon: <LuMinus size={18} />,
            onClick: () => openRemoveUserModal({ email, id }),
            label: "Remove",
          })
          if (!status) {
            // OWNER --CAN-- RESEND EMAIL TO OTHER USERS
            items.push({
              icon: <LuSend size={18} />,
              onClick: () => openResendEmailModal({ email, id, roleName }),
              label: "Resend Invitation",
            })
          }
        }
        break
      case RoleName.Admin:
        if (teamMember.id === user?.portalUserID) {
          // ADMIN --CAN--REMOVE THEMSELVES
          items.push({
            icon: <LuMinus size={18} />,
            onClick: () => openLeaveTeamModal({ email, id }),
            label: "Leave",
          })
        } else {
          // ADMIN --CAN--REMOVE OTHER USERS
          items.push({
            icon: <LuMinus size={18} />,
            onClick: () => openRemoveUserModal({ email, id }),
            label: "Remove",
          })
          if (!status) {
            // ADMIN --CAN-- RESEND EMAIL TO OTHER USERS
            items.push({
              icon: <LuSend size={18} />,
              onClick: () => openResendEmailModal({ email, id, roleName }),
              label: "Resend Invitation",
            })
          }
        }
        break
      case RoleName.Member:
      default:
        if (teamMember.id === user?.portalUserID) {
          // MEMEBER --CAN-- LEAVE ACCOUNT THEMSELVES
          items.push({
            icon: <LuMinus size={18} />,
            onClick: () => openLeaveTeamModal({ email, id }),
            label: "Leave",
          })
        } else {
          // MEMEBER --CANNOT-- TAKE ACTION ON OTHER USERS
        }
        break
    }

    return items
  }, [
    teamMember,
    userRole,
    user?.portalUserID,
    status,
    openRemoveUserModal,
    openResendEmailModal,
    openLeaveTeamModal,
  ])

  return (
    <Flex justify="flex-end">
      {menuItems.length > 0 && (
        <Menu>
          <Menu.Target>
            <ActionIcon
              aria-label="Open team member actions menu"
              radius="xl"
              size={40}
              variant="outline"
            >
              <LuEllipsis />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            {menuItems.map((item, index) => (
              <Menu.Item key={index} leftSection={item.icon} onClick={item.onClick}>
                <Text>{item.label}</Text>
              </Menu.Item>
            ))}
          </Menu.Dropdown>
        </Menu>
      )}
    </Flex>
  )
}

export default TeamMemberAction
