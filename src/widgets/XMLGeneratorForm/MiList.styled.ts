import styled from 'styled-components';

export const DynamicItem = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 5px;
  flex-wrap: wrap;
`;

export const RemoveBtn = styled.button`
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  border-radius: 4px;
  height: fit-content;
  align-self: center;
  &:hover {
    background-color: #c82333;
  }
`; 