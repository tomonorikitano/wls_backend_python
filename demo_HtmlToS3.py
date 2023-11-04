import json
import boto3
from io import StringIO
import csv
import botocore

s3 = boto3.resource('s3')
bucket_name = "kitano-5a-stu-hosei-ac-jp"

def lambda_handler(event, context):
    # パースするJSONデータを取得
    event_data =  json.loads(event['body'])
    #print(event_data)
    
    # JSONデータから "word" と "meaning" を取得
    word = event_data.get("word")
    meaning = event_data.get("meaning")
    wordsID = event_data.get("wordsID")
    
    if word is not None and meaning is not None and wordsID is not None:
        # S3オブジェクトのキーを生成
        key = f"{wordsID}.csv"
        
        try:
            # 既存のS3オブジェクトが存在しない場合、新しいCSVデータを作成
            s3_client = boto3.client('s3')
            s3_client.head_object(Bucket=bucket_name, Key=key)
            existing_object = s3.Object(bucket_name, key)
            existing_data = existing_object.get()['Body'].read().decode('utf-8')
            
            # CSVデータをリストに変換
            csv_list = list(csv.reader(StringIO(existing_data)))
            
            # ヘッダー行以外で指定されたwordが存在するか確認
            found = False
            for i in range(1, len(csv_list)):
                if csv_list[i][0] == word:
                    # wordが存在する場合、該当する行を新しいデータで置き換え
                    csv_list[i][1] = meaning
                    found = True
                    break
            
            # wordが見つからない場合、新しい行を追加
            if not found:
                csv_list.append([word, meaning])
            
            # CSVデータを文字列に戻す
            csv_data = '\n'.join([','.join(row) for row in csv_list])
            
            # 新しいデータを含むCSVデータをS3オブジェクトに格納
            obj = s3.Object(bucket_name, key)
            obj.put(Body=csv_data)
        except botocore.exceptions.ClientError as e:
            if e.response['Error']['Code'] == "404":
                # キーが存在しない場合、新しいCSVデータを作成
                csv_data = f"word,meaning\n{word},{meaning}\n"
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
