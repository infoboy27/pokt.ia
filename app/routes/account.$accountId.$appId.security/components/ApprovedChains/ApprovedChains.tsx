import { Box, Stack, Text } from "@mantine/core"
import React, { Dispatch } from "react"
import { SecurityReducerActions } from "../../utils/stateReducer"
import useModals from "~/hooks/useModals"
import { Blockchain } from "~/models/portal/sdk"
import AddSettingsButton from "~/routes/account.$accountId.$appId.security/components/AddSettingsButton"
import ApprovedChainsModal from "~/routes/account.$accountId.$appId.security/components/ApprovedChainsModal"
import ChainsTable from "~/routes/account.$accountId.$appId.security/components/ChainsTable"

type ApprovedChainsFormProps = {
  approvedChainsIds: string[]
  blockchains: Blockchain[]
  dispatch: Dispatch<SecurityReducerActions>
  readOnly: boolean
}

const ApprovedChains = ({
  approvedChainsIds,
  blockchains,
  dispatch,
  readOnly,
}: ApprovedChainsFormProps) => {
  const { openFullScreenModal } = useModals()

  return (
    <Box py={32}>
      <Stack align="flex-start">
        <Text fw={600}>Approved Chains</Text>
        <Text>Limit the chains that can be used for this application.</Text>
        <AddSettingsButton
          disabled={readOnly}
          onClick={() =>
            openFullScreenModal({
              children: (
                <ApprovedChainsModal
                  approvedChainsIds={approvedChainsIds}
                  blockchains={blockchains}
                  dispatch={dispatch}
                />
              ),
            })
          }
        />
      </Stack>
      {approvedChainsIds.length > 0 && (
        <ChainsTable
          blockchains={blockchains}
          readOnly={readOnly}
          selectedBlockchainsIds={approvedChainsIds}
          onDeleteChain={(id) => dispatch({ type: "blockchains-remove", payload: id })}
        />
      )}
    </Box>
  )
}

export default ApprovedChains
