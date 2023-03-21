import { Flex } from 'components/primitives/Layout';
import { StyledLink } from 'components/primitives/Links';
import { shortenAddress } from 'utils';
import {
  CardTitle,
  MainWrapper,
  FooterElement,
  Detail,
} from './DiscussionCard.styled';
import useENSAvatar from 'hooks/Guilds/ens/useENSAvatar';
import { DiscussionCardProps } from './types';
import { useTypedParams } from 'Modules/Guilds/Hooks/useTypedParams';
import { MdReply } from 'react-icons/md';
import { useEffect, useState } from 'react';
import { useOrbisContext } from 'contexts/Guilds/orbis';
import { BsHandThumbsDown } from 'react-icons/bs';
import { IoHeartOutline } from 'react-icons/io5';
import { Avatar } from 'components/Avatar';
import { FaRegLaughSquint } from 'react-icons/fa';
import { RiFilePaper2Line } from 'react-icons/ri';

export const DiscussionCard: React.FC<DiscussionCardProps> = ({
  discussion,
}) => {
  const { guildId, chainName } = useTypedParams();
  const { orbis } = useOrbisContext();
  const creatorAddress = discussion.creator_details.metadata?.address;
  const { ensName } = useENSAvatar(creatorAddress, 1);
  const [replyCount, setReplyCount] = useState(0);
  const [proposalCount, setProposalCount] = useState(0);
  useEffect(() => {
    const fetchDiscussion = async () => {
      const { data } = await orbis.getPosts({
        context: `DAVI-${guildId}-${discussion.stream_id}-discussions`,
      });
      setReplyCount(data?.length);
    };
    fetchDiscussion();
  }, [discussion, guildId, orbis]);

  useEffect(() => {
    const fetchProposals = async () => {
      const { data, error } = await orbis.getPosts({
        context: `DAVI-${guildId}-${discussion.stream_id}-proposal`,
      });
      if (error) console.log(error);
      setProposalCount(data?.length);
    };
    fetchProposals();
  }, [discussion, guildId, orbis]);
  return (
    <StyledLink
      to={`/${chainName}/${guildId}/discussion/${discussion.stream_id}`}
      data-testid="discussion-card"
    >
      <MainWrapper>
        <Flex direction="row" justifyContent="flex-start">
          <Avatar
            src={discussion?.creator_details?.profile?.pfp}
            defaultSeed={discussion?.creator_details?.metadata?.address}
            size={24}
          />
          <Detail data-testid="discussion-creator">
            {ensName || shortenAddress(creatorAddress)}
          </Detail>
        </Flex>
        <CardTitle data-testid="discussion-title">
          {discussion.content?.title}
        </CardTitle>
        <Flex direction="row" justifyContent="flex-start">
          <FooterElement>
            <IoHeartOutline size="20px" /> {discussion?.count_likes}
          </FooterElement>
          <FooterElement>
            <FaRegLaughSquint size="18px" /> {discussion?.count_haha}
          </FooterElement>
          <FooterElement>
            <BsHandThumbsDown size="20px" /> {discussion?.count_downvotes}
          </FooterElement>
          <FooterElement>
            <MdReply size="20px" /> {replyCount}
          </FooterElement>
          <FooterElement>
            <RiFilePaper2Line size="20px" /> {proposalCount}
          </FooterElement>
        </Flex>
      </MainWrapper>
    </StyledLink>
  );
};
