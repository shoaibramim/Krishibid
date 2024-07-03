import styled from 'styled-components';

export const Container = styled.View`
  flex: 1;
  align-items: center;
  background-color: #fff;
  padding: 20px;
`;

export const Card = styled.View`
    background-color: #f8f8f8;
    width: 95%;
    margin-bottom: 5px;
    border-radius: 16px;
`;

export const UserInfo = styled.View`
    flex-direction: row;
    justify-content: flex-start;
    padding: 15px;
`;

export const UserImg = styled.Image`
    width: 50px;
    height: 50px;
    border-radius: 25px;
`;

export const UserInfoText = styled.View`
    flex-direction: column;
    justify-content: center;
    margin-left: 10px;
`;

export const UserName = styled.Text`
    font-size: 16px;
    font-family: 'DMBold';
    color: #002D02;
`;

export const PostTime = styled.Text`
    font-size: 12px;
    font-family: 'DMMedium';
    color: #002D02;
    opacity: .35;
`;

export const PostText = styled.Text`
    font-size: 14px;
    font-family: 'DMRegular';
    padding-left: 15px;
    padding-right: 15px;
    margin-bottom: 15px;
`;

export const PostImg = styled.Image`
    width: 100%;
    height: 300px;
    padding-left: 15px;
    padding-right: 15px;
`;

export const Divider = styled.View`
    border-bottom-color: #002D02;
    border-bottom-width: 1px;
    width: 92%;
    align-self: center;
    margin-top: 5px;
`;

export const InteractionWrapper = styled.View`
    flex-direction: row;
    gap: 5px;
    padding: 15px;
`;

export const Interaction = styled.TouchableOpacity`
    flex-direction: row;
    justify-content: center;
    border-radius: 5px;
    padding: 2px 5px;
`;

export const InteractionText = styled.Text`
    font-size: 12px;
    font-family: 'DMBold';
    color: #002D02;
    margin-top: 5px;
    margin-left: 5px;
`;