import json
import boto3
from io import StringIO
import csv
import botocore
from datetime import datetime, timedelta, timezone
JST = timezone(timedelta(hours=9))


s3 = boto3.resource('s3')
bucket_name = "kitano-5a-stu-hosei-ac-jp"
interval = 0

def lambda_handler(event, context):
    # パースするJSONデータを取得
    print(event)
    event_data =  event
    #print(event_data)
    
    # JSONデータから "word" と "meaning" を取得
    word = event_data.get("word")
    #meaning = event_data.get("meaning")#meaningは送られてこない
    wordsID = event_data.get("wordsID")
    result = event_data.get("result")
    timestamp = datetime.now(tz=JST)
    memorylevel_str = event_data.get("memorylevel")
    
    if memorylevel_str is not None:
        memorylevel = int(memorylevel_str)
        
        if result == "correct" and memorylevel > 0:
            s3_key = f"{wordsID}.csv"
            
            s3_client = boto3.client('s3')
            response = s3_client.get_object(Bucket=bucket_name, Key=s3_key)
            csv_data = response['Body'].read().decode('utf-8')
            csv_list = list(csv.reader(StringIO(csv_data)))
            
            for i in range(1, len(csv_list)):
                    if csv_list[i][0] == word:
                        
                        time_str = csv_list[i][3]
                        time = datetime.strptime(time_str, "%Y-%m-%d %H:%M:%S").replace(tzinfo=JST)
                        break
                    
            print(timestamp)
            print(time)
            
            interval = timestamp - time
            
            time = time.strftime("%Y-%m-%d %H:%M:%S")
            
            interval = int(interval.days)
            print(interval)
            
        if memorylevel == 0 and result =="correct":
            memorylevel = 1
            time = timestamp.strftime("%Y-%m-%d %H:%M:%S")
            
            interval = 0
            
        if memorylevel == 1 and result == "correct" and interval >= 1:
            memorylevel = 2
        
        if memorylevel == 2 and result == "correct" and interval >= 7:
            memorylevel = 3
            
        if memorylevel == 3 and result == "correct" and interval >= 14:
            memorylevel = 4
            
        if memorylevel == 4 and result == "correct" and interval >= 30:
            memorylevel = 5
            
        if memorylevel == 5 and result == "correct" and interval >= 60:
            memorylevel = 6
            
        if result == "noAnswer" or result == "incorrect":
            memorylevel = 0
            time = timestamp.strftime("%Y-%m-%d %H:%M:%S")
        
    
    if word is not None and wordsID is not None and result is not None and memorylevel_str is not None:
        # S3オブジェクトのキーを生成
        key = f"{wordsID}.csv"
        
        try:
            # 既存のS3オブジェクトが存在する場合csvを書き換え
            s3_client = boto3.client('s3')
            s3_client.head_object(Bucket=bucket_name, Key=key)
            existing_object = s3.Object(bucket_name, key) #wordIDの検索eならexceptへ進む
            existing_data = existing_object.get()['Body'].read().decode('utf-8')
            
            # CSVデータをリストに変換
            csv_list = list(csv.reader(StringIO(existing_data)))
            
            # ヘッダー行(word,meaning)以外で指定されたwordが存在するか確認
            
            for i in range(1, len(csv_list)):
                if csv_list[i][0] == word:
                    # 該当するwordのresult上書き
                    
                    csv_list[i][3] = time
                    csv_list[i][4] = str(memorylevel)
                    
                    break
                
            new_memorylevel = {
                "new_memorylevel" : memorylevel
            }
            

            # CSVデータを文字列に戻す
            csv_data = '\n'.join([','.join(row) for row in csv_list])
            
            # 新しいデータを含むCSVデータをS3オブジェクトに格納
            obj = s3.Object(bucket_name, key)
            obj.put(Body=csv_data)
            
        except botocore.exceptions.ClientError as e:
            if e.response['Error']['Code'] == "404":
                # キーが存在しない場合、新しいCSVデータを作成
                #csv_data = f"word,meaning\n{word},{meaning}\n"
                #obj = s3.Object(bucket_name, key)
                #obj.put(Body=csv_data)
                pass
            else:
                # その他のエラーの場合はエラーを発生
                raise e
        
        #print(json.dumps(new_memorylevel,indent=2))
        
        return {
            'isBase64Encoded': False,
            'statusCode': 200,
            'header': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
                
            },   
            
            'body':json.dumps(new_memorylevel,indent=2)
        }
    else:
        return {
            'isBase64Encoded': False,
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
                
            },
            'body': json.dumps('JSONデータ内に "word", "result", および "memorylevel" が必要です。')
        }
