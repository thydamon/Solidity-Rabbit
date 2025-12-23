import hashlib
import json
from time import time
from uuid import uuid4

from flask import Flask, request, jsonify

"""
区块链实现
url:https://learnblockchain.cn/2017/10/27/build_blockchain_by_python/
"""
class Blockchain(object):
    def __init__(self):
        self.chain = []
        self.current_transactions = []

        # Create the genesis block
        self.new_block(previous_hash=1, proof=100)

    def new_block(self, proof, previous_hash=None):
        """
        生成新区块，当Blockchain实例化后，我们需要构造一个创世块（没有前区块的第一个区块），并且给它加上一个工作量证明。
        每个区块都需要经过工作量证明，俗称挖矿。
        :param proof:
        :param previous_hash:
        :return:
        """

        block = {
            'index': len(self.chain) + 1,
            'timestamp': time(),
            'transactions': self.current_transactions,
            'proof': proof,
            'previous_hash': previous_hash or self.hash(self.chain[-1])
        }

        self.current_transactions = []
        self.chain.append(block)

        return block

    def new_transaction(self, sender, receiver, amount):
        """
        生成新交易信息，信息将加入到下一个待挖的区块中
        :param sender: <str> 发送方地址
        :param receiver: <str> 接收方地址
        :param amount: <int> 交易金额
        :return: <int> 交易索引
        """

        self.current_transactions.append({
            'sender': sender,
            'receiver': receiver,
            'amount': amount
        })

        return self.last_block["index"] + 1

    @staticmethod
    def hash(block):
        """
        生成的SHA-256 hash值，该方法通过 标准化字典序列化（sort_keys=True）确保区块数据的哈希计算具备一致性，避免因 JSON 键顺序差异导致无效哈希分歧，是区块链不可篡改特性的基础技术实现。
        :param block: <dict> Block
        :return:  <str>
        """

        # We must make sure that the Dictionary is Ordered, or we'll have inconsistent hashes
        # 将区块字典转为 有序 JSON 字符串（sort_keys=True 确保按键名排序），然后编码为 bytes 类型
        block_string = json.dumps(block, sort_keys=True).encode()
        # 计算字节数据的 SHA-256 哈希值，并将其转换为十六进制字符串
        return hashlib.sha256(block_string).hexdigest()

    @property
    def last_block(self):
        return self.chain[-1]

    def proof_of_work(self, last_proof):
        """
        简单的工作量证明：
         - 查找一个p'使得hash(pp')这个以4个0开头
         - p是上一个块的证明，p'是当前的证明
        工作量证明的理解：
         新的区块依赖工作量证明算法（PoW）来构造。PoW的目标是找出一个符合特定条件的数字，这个数字很难计算出来，但容易验证。这就是工作量证明的核心思想。
         为了方便理解，举个例子：
         假设一个整数 x 乘以另一个整数 y 的积的 Hash 值必须以 0 结尾，即 hash(x * y) = ac23dc...0。设变量 x = 5，求 y 的值？
         在比特币中，使用称为Hashcash的工作量证明算法，它和上面的问题很类似。矿工们为了争夺创建区块的权利而争相计算结果。
         通常，计算难度与目标字符串需要满足的特定字符的数量成正比，矿工算出结果后，会获得比特币奖励。
        :param last_proof:
        :return:
        """

        proof = 0
        while self.valid_proof(last_proof, proof) is False:
            proof += 1

        return proof

    @staticmethod
    def valid_proof(last_proof, proof):
        """
        验证证明：是否hash(last_proof, proof)以4个0开头
        :param last_proof:
        :param proof:
        :return:
        """

        guess = f'{last_proof}{proof}'.encode()
        guess_hash = hashlib.sha256(guess).hexdigest()
        return guess_hash[:4] == "0000"

app = Flask(__name__)

node_identifier = str(uuid4()).replace('-', '')
blockchain = Blockchain()

@app.route('/mine', methods=['GET'])
def mine():
    last_block = blockchain.last_block
    last_proof = last_block["proof"]
    proof = blockchain.proof_of_work(last_proof)

    # 给工作量证明的节点提供奖励
    # 发送者为“0”表示是新挖出的币
    blockchain.new_transaction(
        sender="0",
        receiver=node_identifier,
        amount=1,
    )

    # forge the new Block by adding it to the chain
    block = blockchain.new_block(proof)

    response = {
        'message': 'New Block Forged',
        'index': block['index'],
        'transactions': block['transactions'],
        'proof': block['proof'],
        'previous_hash': block['previous_hash'],
    }

    return jsonify(response), 200

@app.route('/transactions/new', methods=['POST'])
def new_transaction():
    values = request.get_json()

    required = ['sender', 'recipient', 'amount']
    if not all(k in values for k in required):
        return 'Missing values', 400

    index = blockchain.new_transaction(values['sender'],values['receiver'],values['amount'])

    response = {'message': f'Transaction will be added to Block {index}'}
    return jsonify(response), 201

@app.route('/chain', methods=['GET'])
def full_chain():
    response = {
        'chain': blockchain.chain,
        'length': len(blockchain.chain)
    }

    return json.dumps(response), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)