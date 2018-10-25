    import React from "react";
    import { GiftedChat, Bubble } from "react-native-gifted-chat";
    import Chatkit from "@pusher/chatkit";
    import { View, Text } from "native-base";
    import Utils from '../Utils/Utils.js';
    import Analytics from '../Utils/Analytics.js';
    import {authUserChatkit} from '../ProfileScreen/ApiProfile.js';

    //const CHATKIT_TOKEN_PROVIDER_ENDPOINT = "https://us1.pusherplatform.io/services/chatkit_token_provider/v1/face2cfa-7db2-45ed-a424-f35d66af93eb/token";
    const CHATKIT_INSTANCE_LOCATOR = "v1:us1:face2cfa-7db2-45ed-a424-f35d66af93eb";
    const CHATKIT_ROOM_ID = 15129927;

    export default class MyChat extends React.Component {

      constructor(props) {
        super(props);

        this.state = {
          messages: [],
          usuario : null,
          authUser : null,
          olderIdMessage : null
        };

        this.util = new Utils();

        this.analytics = new Analytics();
        this.analytics.trackScreenView("MyChat");
      }


      async componentDidMount() {

        let resutGet = await this.util.getKeyAndGetAuthChatkit("AuthIEB","usuario", this);

        const tokenProvider = new Chatkit.TokenProvider({
          //url: CHATKIT_TOKEN_PROVIDER_ENDPOINT
          url: "http://invertirenbolsa.manuelrispolez.com/authUserChatkit.php",
          queryParams: {
            user: this.state.usuario
          }
        });

        const chatManager = new Chatkit.ChatManager({
          instanceLocator: CHATKIT_INSTANCE_LOCATOR,
          userId: this.state.usuario,
          tokenProvider: tokenProvider
        });

        chatManager.connect().then(currentUser => {
          this.currentUser = currentUser;
          this.currentUser.subscribeToRoom({
            roomId: CHATKIT_ROOM_ID,
            hooks: {
              onNewMessage: this.onReceive.bind(this)
            }
          });
        });

      }

      onReceive(data, blnPrepend = false) {
        const { id, senderId, text, createdAt } = data;
        const incomingMessage = {
          _id: id,
          text: text,
          createdAt: new Date(createdAt),
          user: {
            _id: senderId,
            name: senderId
            //avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmXGGuS_PrRhQt73sGzdZvnkQrPXvtA-9cjcPxJLhLo8rW-sVA"
          }
        };

        if ((this.state.olderIdMessage == null) || (this.state.olderIdMessage > id)) {
          this.setState({olderIdMessage: id});
          //console.log("Guardamos idMessage:",id);
        }

        if (blnPrepend) {
          //console.log("prepend")
          this.setState(previousState => ({
            messages: GiftedChat.prepend(previousState.messages, incomingMessage),
          }));
        } else {
          //console.log("append")
          this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, incomingMessage),
          }));
        }
      }

      onSend([message]) {
        this.currentUser.sendMessage({
          text: message.text,
          roomId: CHATKIT_ROOM_ID
        });
      }

      getOlderMessages() {
        this.currentUser.fetchMessages({
        roomId: CHATKIT_ROOM_ID,
        initialId: this.state.olderIdMessage,
        direction: 'older',
        limit: 20,
      })
        .then(messages => {
          // do something with the messages
          //console.log("mensajes viejos", messages)

          messages.forEach((msg) => {
            this.onReceive(msg, true);

          })

        })
        .catch(err => {
          console.log('Error fetching messages: ')
        })
      }

      renderBubble(props) {
        if ((props.isSameUser(props.currentMessage, props.previousMessage) &&
             props.isSameDay(props.currentMessage, props.previousMessage)) ||
             (props.currentMessage.user.name == props.user._id)) {
          return (
            <Bubble
              {...props}
            />
          );
        }

        return (
          <View>
            <Text style={styles.name}>{props.currentMessage.user.name}</Text>
            <Bubble
              {...props}
            />
          </View>
        );
      }

      renderUsername() {
          const username = this.props.currentMessage.user.name;
          if (username) {
            const { containerStyle, wrapperStyle, ...usernameProps } = this.props;
            if (this.props.renderUsername) {
              return this.props.renderUsername(usernameProps);
            }
            return (
              <Text style={[styles.standardFont, styles.headerItem, styles.username, this.props.usernameStyle]}>
                {username}
              </Text>
            );
          }
          return null;
        }

      render() {
        return <GiftedChat
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          onLoadEarlier={messages => this.getOlderMessages()}
          alwaysShowSend={true}
          user={{
           _id: this.state.usuario
          }}
          placeholder={"Escribe un mensaje..."}
          showUserAvatar={true}
          loadEarlier={true}
          //isLoadingEarlier={true}
          showUserAvatar={true}
          renderAvatarOnTop={true}
          renderUsername={true}
          renderBubble={this.renderBubble}
          maxInputLength={155}
        />;
      }
    }

    const styles = {
      name: {
        color: "#aaaaaa",
        paddingLeft: 10,
        paddingBottom: 5,
        fontStyle: "italic"
      }
    };
