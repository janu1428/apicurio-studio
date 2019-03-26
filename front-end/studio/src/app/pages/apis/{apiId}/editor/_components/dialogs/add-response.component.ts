/**
 * @license
 * Copyright 2017 JBoss Inc
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {Component, EventEmitter, Output, QueryList, ViewChildren} from "@angular/core";
import {ModalDirective} from "ngx-bootstrap";
import {Oas20Operation, Oas30Operation} from "oai-ts-core";
import {DropDownOption, DropDownOptionValue as Value, DIVIDER} from "../../../../../../components/common/drop-down.component";

export class HttpCode {

    private code: number;
    private name: string;

    public constructor(code: number, name: string) {
        this.code = code;
        this.name = name;
    }

    public getCode(): number {
        return this.code;
    }

    public getName(): string {
        return this.name;
    }
}

export class HttpCodeUtil {

    private static HTTP_CODE_LIST_COMMON: HttpCode[] = [
        new HttpCode(200, "OK"),
        new HttpCode(201, "Created"),
        new HttpCode(204, "No Content"),
        new HttpCode(400, "Bad Request"),
        new HttpCode(401, "Unauthorized"),
        new HttpCode(403, "Forbidden"),
        new HttpCode(404, "Not Found")
    ];

    private static HTTP_CODE_LIST: HttpCode[] = [
        new HttpCode(100, "Continue"),
        new HttpCode(101, "Switching Protocols"),
        new HttpCode(102, "Processing"),
        new HttpCode(200, "OK"),
        new HttpCode(201, "Created"),
        new HttpCode(202, "Accepted"),
        new HttpCode(203, "Non_Authoritative"),
        new HttpCode(204, "No Content"),
        new HttpCode(205, "Reset Content"),
        new HttpCode(206, "Partial Content"),
        new HttpCode(207, "Multi-Status"),
        new HttpCode(208, "Already Reported"),
        new HttpCode(226, "IM Used"),
        new HttpCode(300, "Multiple Choices"),
        new HttpCode(301, "Moved Permanently"),
        new HttpCode(302, "Found"),
        new HttpCode(303, "See Other"),
        new HttpCode(304, "Not Modified"),
        new HttpCode(305, "Use Proxy"),
        new HttpCode(306, "Switch Proxy"),
        new HttpCode(307, "Temporary Redirect"),
        new HttpCode(308, "Permanent Redirect"),
        new HttpCode(400, "Bad Request"),
        new HttpCode(401, "Unauthorized"),
        new HttpCode(402, "Payment Required"),
        new HttpCode(403, "Forbidden"),
        new HttpCode(404, "Not Found"),
        new HttpCode(405, "Method Not Allowed"),
        new HttpCode(406, "Not Acceptable"),
        new HttpCode(407, "Proxy Authentication Required"),
        new HttpCode(408, "Request Time-Out"),
        new HttpCode(409, "Conflict"),
        new HttpCode(410, "Gone"),
        new HttpCode(411, "Length Required"),
        new HttpCode(412, "Precondition Failed"),
        new HttpCode(413, "Payload Too Large"),
        new HttpCode(414, "URI Too Long"),
        new HttpCode(415, "Unsupported Media Type"),
        new HttpCode(416, "Range Not Satisfiable"),
        new HttpCode(417, "Expectation Failed"),
        new HttpCode(418, "I'm a teapot!"),
        new HttpCode(421, "Misdirected Request"),
        new HttpCode(422, "Unprocessable Entity"),
        new HttpCode(423, "Locked"),
        new HttpCode(424, "Failed Dependency"),
        new HttpCode(426, "Upgrade Required"),
        new HttpCode(428, "Precondition Required"),
        new HttpCode(429, "Too Many Requests"),
        new HttpCode(431, "Request Header Fields Too Large"),
        new HttpCode(451, "Unavailable For Legal Reasons"),
        new HttpCode(500, "Internal Server Error"),
        new HttpCode(501, "Not Implemented"),
        new HttpCode(502, "Bad Gateway"),
        new HttpCode(503, "Service Unavailable"),
        new HttpCode(504, "Gateway Time-Out"),
        new HttpCode(505, "HTTP Version Not Supported"),
        new HttpCode(506, "Variant Also Negotiates"),
        new HttpCode(507, "Insufficient Storage"),
        new HttpCode(508, "Loop Detected"),
        new HttpCode(510, "Not Extended"),
        new HttpCode(511, "Network Authentication Required")
    ];

    public static getCommonlyUsedHttpCodeList() : HttpCode[] {
        // TODO defensive copy? Make non-static?
        return this.HTTP_CODE_LIST_COMMON;
    }

    public static getHttpCodeList() : HttpCode[] {
        // TODO defensive copy? Make non-static?
        return this.HTTP_CODE_LIST;
    }

    public static generateDropDownOptions(): DropDownOption[] {
        // TODO cache this?
        let res: DropDownOption[] = this.HTTP_CODE_LIST_COMMON.map(e => {
            let strcode = String(e.getCode());
            return new Value(strcode + " " + e.getName(), strcode);
        });
        res.push(DIVIDER);

        let nextDividerAfter = 199;
        this.HTTP_CODE_LIST.forEach(e => {
            if(e.getCode() > nextDividerAfter) {
                nextDividerAfter += 100;
                res.push(DIVIDER);
            }
            let strcode = String(e.getCode());
            res.push(new Value(strcode + " " + e.getName(), strcode));
        });

        return res;
    }
}

@Component({
    moduleId: module.id,
    selector: "add-response-dialog",
    templateUrl: "add-response.component.html"
})
export class AddResponseDialogComponent {

    @Output() onAdd: EventEmitter<string> = new EventEmitter<string>();

    @ViewChildren("addResponseModal") addResponseModal: QueryList<ModalDirective>;

    private _isOpen: boolean = false;

    private _statusCode: string = "";
    get statusCode() {
        return this._statusCode;
    }
    set statusCode(code: string) {
        this._statusCode = code;
        if (this.codes.indexOf(code) !== -1) {
            this.codeExists = true;
        } else {
            this.codeExists = false;
        }
    }

    codes: string[] = [];
    codeExists: boolean = false;

    /**
     * Called to open the dialog.
     * @param parent
     * @param statusCode
     */
    public open(parent: Oas20Operation | Oas30Operation, statusCode?: string): void {
        this.statusCode = statusCode;
        if (!statusCode) {
            this.statusCode = "";
        }
        this._isOpen = true;
        this.addResponseModal.changes.subscribe( thing => {
            if (this.addResponseModal.first) {
                this.addResponseModal.first.show();
            }
        });

        this.codes = [];
        this.codeExists = false;
        if (parent.responses) {
            this.codes = parent.responses.responseStatusCodes();
        }
    }

    /**
     * Called to close the dialog.
     */
    close(): void {
        this._isOpen = false;
        this.statusCode = "";
    }

    /**
     * Called when the user clicks "add".
     */
    add(): void {
        if (this.isValid()) {
            this.onAdd.emit(this.statusCode);
            this.cancel();
        }
    }

    /**
     * Called when the user clicks "cancel".
     */
    cancel(): void {
        this.addResponseModal.first.hide();
    }

    /**
     * Returns true if the dialog is open.
     */
    isOpen(): boolean {
        return this._isOpen;
    }

    /**
     * Returns true if today is the first of April.  (teapot related)
     */
    isAprilFirst(): boolean {
        let d: Date = new Date();
        return d.getMonth() === 3 && d.getDate() === 1;
    }

    /**
     * Check to see if the form is valid.
     */
    isValid(): boolean {
        return this.statusCode && !this.codeExists;
    }

    public getStatusCodeDropDownOptions(): DropDownOption[] {
        return HttpCodeUtil.generateDropDownOptions()
            .filter(e => e.isDivider() || this.isAprilFirst() || (!this.isAprilFirst() && e.getValue() !== "418"));
    }

    public getStatusCode(): string {
        return this.statusCode;
    }

    public setStatusCode(statusCode: string) {
        this.statusCode = statusCode;
    }
}
