#!/usr/bin/env python
# coding: utf-8

# In[ ]:


import exam1_2
import exam2_3
import pymysql
import atexit

from flask import Flask, request
from flask import jsonify, render_template
from flask_cors import CORS

from flask_socketio import SocketIO

from gevent import pywsgi
from geventwebsocket.handler import WebSocketHandler

app = Flask(__name__)
CORS(app) # 그냥 보안상 존재함
app.config['SECRET_KEY'] = '1234'
socketio = SocketIO(app, cors_allowed_origins="*")

# MySQL 연결 설정
app.config["MYSQL_HOST"] = "project-db-stu3.smhrd.com"  # MySQL 호스트 주소
app.config["MYSQL_USER"] = "Insa4_IOTA_final_2"  # MySQL 사용자 이름
app.config["MYSQL_PASSWORD"] = "aischool2"  # MySQL 비밀번호
app.config["MYSQL_DB"] = "Insa4_IOTA_final_2"  # 사용할 데이터베이스 이름
app.config["MYSQL_PORT"] = 3307  # MySQL 포트 번호

# MySQL 연결
mysql_conn = pymysql.connect(
    host=app.config["MYSQL_HOST"],
    user=app.config["MYSQL_USER"],
    password=app.config["MYSQL_PASSWORD"],
    database=app.config["MYSQL_DB"],
    port=app.config["MYSQL_PORT"],
    cursorclass=pymysql.cursors.DictCursor
    )

#전역변수로 사용할 original_sentence, translate_sentence 선언
global original_sentence
global translated_sentence


@app.route('/')
def index():
    return render_template('index.html')


# 클라이언트로부터 웹소켓 메시지를 받는 이벤트 핸들러
@socketio.on('message')
def handle_message(client_message):
    sender_id = request.sid
    print('Received message:', client_message, 'from', sender_id)
    result = run_ai_model(client_message)     # AI 모델을 사용하여 결과 생성
    #socketio.broadcast.emit('response', result)     # 결과를 클라이언트에게 보냅니다.
    print("받은 메세지 : ", result)
    socketio.emit('response', {'message': result, 'sender_id': sender_id})
    global original_sentence
    original_sentence = client_message

def run_ai_model(client_message):
    # AI 모델의 예측을 수행하고 결과를 반환합니다.
    if exam1_2.sentence_predict(client_message) == 0:
        result = exam2_3.sentence_predict(client_message)
    elif exam1_2.sentence_predict(client_message) == 2:
        result = "그런 말은 하면 안 돼요"
    else :
        result = client_message
    global translated_sentence
    translated_sentence = result
    return result

#싫어요 제출하면 받아서 db에 저장하는 함수
@app.route('/submit_dislike', methods=['POST'])
def submit_dislike():
    cursor=mysql_conn.cursor()
    gender = request.form.get('gender')
    age = request.form.get('age')
    dislike_reason = request.form.get('dislike_reason')
    reason_etc = request.form.get('reason_etc')
    global original_sentence
    global translated_sentence
    
    # MySQL 데이터베이스에 연결
    try:
        # SQL 쿼리 실행
        if dislike_reason == 'reason3':
            sql = "INSERT INTO bad_translate_reason (gender, age, reason, originalSentence, translateSentence) VALUES (%s, %s, %s, %s, %s)"
            cursor.execute(sql, (gender, age, reason_etc, original_sentence, translated_sentence))             
        else:
            sql = "INSERT INTO bad_translate_reason (gender, age, reason, originalSentence, translateSentence) VALUES (%s, %s, %s, %s, %s)"
            cursor.execute(sql, (gender, age, dislike_reason, original_sentence, translated_sentence))
               
        # 변경사항을 커밋
        mysql_conn.commit()
        # 응답 데이터를 생성
        response_data = {'result': '데이터베이스에 저장 완료'}

    except Exception as e:
        # 오류 발생 시 롤백
        mysql_conn.rollback()
        response_data = {'error': str(e)}
    finally:
        # 연결 종료
        cursor.close()
        print(response_data)

    return jsonify(response_data)

#관리자 페이지에 데이터 불러오기
@app.route("/administrator")
def administrator():
    # 커서 객체 생성
    cursor = mysql_conn.cursor()

    # 데이터베이스에서 데이터 검색
    query = "SELECT * FROM bad_translate_reason" 
    cursor.execute(query)

    data = cursor.fetchall()
    cursor.close()

    # admin.html에 데이터 전달
    return render_template("admin.html", data=data)

# Flask 앱 종료 시 MySQL 연결 닫기
def close_mysql_connection():
    if mysql_conn:
        mysql_conn.close()
        print("MySQL connection closed.")

# Flask 앱 종료 시 close_mysql_connection 함수 호출
atexit.register(close_mysql_connection)

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5020,debug=True)

