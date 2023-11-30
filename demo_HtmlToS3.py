import json
import boto3
from io import StringIO
import csv
import botocore

s3 = boto3.resource('s3')
bucket_name = "xxxxxxxxx"

def lambda_handler(event, context):
    global s3
    # パースするJSONデータを取得
    print(event)
    #event_data =  json.loads(event['body'])
    event_data =  event
    #print(event_data)
    
    mode = event_data.get("mode")
    
    if mode == "register":
        # JSONデータから "word" と "meaning" などを取得
        word = event_data.get("word")
        meaning = event_data.get("meaning")
        wordsID = event_data.get("wordsID")
        item = event_data.get("item")
        
        if word is not None and meaning is not None and wordsID is not None:
            # S3オブジェクトのキーを生成
            key = f"{wordsID}.csv"
            
            try:
                # 既存のS3オブジェクトが存在しない場合、新しいCSVデータを作成
                s3_client = boto3.client('s3')
                s3_client.head_object(Bucket=bucket_name, Key=key)#バケット検索
                existing_object = s3.Object(bucket_name, key)#単語帳検索
                existing_data = existing_object.get()['Body'].read().decode('utf-8')
                
                # CSVデータをリストに変換
                csv_list = list(csv.reader(StringIO(existing_data)))
                
                # ヘッダー行以外で指定されたwordが存在するか確認
                found = False
                for i in range(1, len(csv_list)):
                    if csv_list[i][0] == word:
                        # wordが存在する場合、該当する行を新しいデータで置き換え
                        csv_list[i][1] = meaning
                        csv_list[i][2] = item
                        found = True
                        break
                
                # wordが見つからない場合、新しい行を追加
                if not found:
                    timestamp = "0"
                    memorylevel = "0"
                    
                    csv_list.append([word, meaning, item,timestamp,memorylevel])
                
                # CSVデータを文字列に戻す
                csv_data = '\n'.join([','.join(row) for row in csv_list])
                
                # 新しいデータを含むCSVデータをS3オブジェクトに格納
                obj = s3.Object(bucket_name, key)
                obj.put(Body=csv_data)
                
            except botocore.exceptions.ClientError as e:
                if e.response['Error']['Code'] == "404":
                    # キーが存在しない場合、新しいCSVデータを作成
                    timestamp = 0
                    memorylevel = 0
                    
                    csv_data = f"word,meaning,item,timestamp,memorylevel\n{word},{meaning},{item},{timestamp},{memorylevel}\n"
                    
                    obj = s3.Object(bucket_name, key)
                    obj.put(Body=csv_data)
                else:
                    # その他のエラーの場合はエラーを発生
                    raise e
            
            return {
                'isBase64Encoded': False,
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
                },
                'body': json.dumps('S3オブジェクトにデータを保存しました。')
            }
        else:
            return {
                'isBase64Encoded': False,
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
                },
                'body': json.dumps('JSONデータ内に "word", "meaning", および "wordsID" が必要です。')
            }
    elif mode == "delete all":
        
        wordsID = event_data.get("wordsID")
        object_key = f"{wordsID}.csv"
        
        s3 = boto3.client('s3')
        
        s3.delete_object(
            Bucket = bucket_name,
            Key = object_key
            )
            
        return {
            'isBase64Encoded': False,
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
            },
            'body': json.dumps('S3オブジェクトからデータを削除しました。')
        }
            
    else:
        wordsID = event_data.get("wordsID")
        word = event_data.get("word")
        
        s3 = boto3.client('s3')
        
        object_key = f"{wordsID}.csv"
        
        response = s3.get_object(Bucket=bucket_name, Key=object_key)
        csv_data = response['Body'].read().decode('utf-8')
        
        csv_list = list(csv.reader(StringIO(csv_data)))
        found = False
        for i in range(1, len(csv_list)):
            if csv_list[i][0] == word:
                del csv_list[i]
                found = True
                break
            
        new_csv_data = '\n'.join([','.join(row) for row in csv_list])
        
        s3.put_object(
        Bucket=bucket_name,
        Key=object_key,
        Body=new_csv_data,
        ContentType='text/csv'
        )
        
        return {
            'isBase64Encoded': False,
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
            },
            'body': json.dumps('S3オブジェクトから該当するwordを削除しました。')
        }
